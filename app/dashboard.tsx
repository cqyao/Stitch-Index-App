import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import {
  Provider,
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Input from "../components/SearchInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Features from "../components/Features";
import AppointmentCard from "@/components/AppointmentCard";
import { auth, db } from "@/firebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { User } from "firebase/auth";
import Constants from "expo-constants";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Markdown from 'react-native-markdown-display';
import { LinearGradient } from "expo-linear-gradient";

type AppointmentProps = {
  id: string;
  patientId: string;
  status: boolean;
  time: string;
  type: string;
  doctorId: string;
};

const Dashboard = () => {
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // State variables for appointments
  const [appointments, setAppointments] = useState<AppointmentProps[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentProps[]>([]);

  // State variables for chat functionality
  const [chatVisible, setChatVisible] = useState(false);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);

  // Function to fetch image URL from Firebase Storage
  const fetchImageFromFirebase = async (path: string): Promise<string | null> => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, path);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error fetching image from Firebase Storage", error);
      return null;
    }
  };

  // Function to fetch and set image URL
  const fetchImageUrl = async (user: User) => {
    try {
      const url = await fetchImageFromFirebase(`pfp/${user.uid}`);
      if (url) {
        setImageUrl(url);
      }
    } catch (error) {
      console.error("Error fetching image URL:", error);
    } finally {
      setLoadingImage(false);
    }
  };

  // Function to fetch appointments with real-time updates
  const fetchAppointments = (userId: string) => {
    const appointmentsCollection = collection(db, "Appointments");
    const q = query(appointmentsCollection, where("doctorId", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appointmentsList: AppointmentProps[] = querySnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
      ) as AppointmentProps[];

      setAppointments(appointmentsList);

      // Filter upcoming appointments (status: false)
      const upcoming = appointmentsList.filter((appointment) => !appointment.status);
      setUpcomingAppointments(upcoming);
    });

    // Return the unsubscribe function to clean up the listener
    return unsubscribe;
  };

  // Handle user sign-out
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await auth.signOut();
      Alert.alert("Success", "You have been signed out.");
      router.replace({ pathname: "./signIn" });
    } catch (error) {
      Alert.alert("Error", "An error occurred while signing out.");
      console.error("Error signing out: ", error);
    }
  };

  // Function to handle search submission
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: "./search",
        params: { query: searchQuery },
      });
    }
  };

  // Retrieve user UID from AsyncStorage and fetch image URL and appointments
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeUser = async () => {
      setLoading(true);
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          setUser(user);
          await fetchImageUrl(user);
          unsubscribe = fetchAppointments(user.uid); // Set up the listener here
        } else {
          router.push({ pathname: "./signIn" });
        }
      } catch (error) {
        console.error("Error retrieving user from AsyncStorage", error);
      } finally {
        setLoading(false);
        setLoadingImage(false);
      }
    };
    initializeUser();

    // Clean up the listener when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const KEY = Constants.expoConfig?.extra?.openAI_key;

  // Function to get response from API
  const getChatGPTResponse = async (question: string) => {
    setLoadingResponse(true);

    try {
      const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                  "A compassionate and skilled physician is discussing a complex patient case with a fellow doctor using a secure chatbot. " +
                  "The patient presents with a mix of symptoms that don’t point to a clear diagnosis, prompting the physician to seek their colleague’s input to refine the approach. " +
                  "The physician explains the patient's history, current symptoms, and the tests conducted so far, then requests thoughts on further diagnostic steps, possible differential diagnoses, and treatment options. " +
                  "Together, the doctors collaborate to ensure the patient receives the best possible care.",
            },
            {
              role: "user",
              content: question,
            },
          ],
          max_tokens: 500,
        }),
      });

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        console.error("Error from OpenAI API:", data);
        Alert.alert(
            "Error",
            data.error?.message || "An error occurred with OpenAI API"
        );
        setLoadingResponse(false);
        return;
      }

      if (data.choices && data.choices.length > 0) {
        const messageContent = data.choices[0].message.content.trim();
        setResponse(messageContent);
      } else {
        console.error("No choices returned from the API. Full response:", data);
        Alert.alert("Error", "No response from OpenAI API");
      }
    } catch (error) {
      console.error("Error fetching response from OpenAI:", error);
      Alert.alert("Error", "Failed to fetch response from OpenAI API");
    }

    setLoadingResponse(false);
  };

  return (
      <Provider>
        <SafeAreaView style={styles.container}>
          <View style={styles.stitch}>
            <Image
                resizeMode="contain"
                source={require("../assets/images/backgroundimage.png")}
            />
          </View>

          <View style={styles.banner}>
            <Text></Text>
            <TouchableOpacity style={styles.profilePic} onPress={handleSignOut}>
              {loadingImage ? (
                  <ActivityIndicator size="small" color="#02D6B6" />
              ) : imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.profileImage} />
              ) : (
                  <MaterialIcons name="face" size={40} color="black" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.panel}>
            <View style={styles.searchInput}>
              <Input
                  defaultValue={searchQuery}
                  onSearch={(value: any) => {
                    router.push({
                      pathname: "./search",
                      params: { query: value },
                    });
                  }}
              />
            </View>

            <View style={styles.features}>
              <Text style={[styles.h2, { color: "#148085" }]}>Features</Text>

              <View style={[styles.row, styles.featherEffect]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <Pressable
                      style={styles.featurePressable}
                      onPress={() => router.push({ pathname: "./patient" })}
                  >
                    <Features name="My Patients" icon="user" />
                  </Pressable>
                  <Pressable
                      style={styles.featurePressable}
                      onPress={() => router.push({ pathname: "./research" })}
                  >
                    <Features name="Research" icon="book" />
                  </Pressable>
                  <Pressable
                      style={styles.featurePressable}
                      onPress={() => router.push({ pathname: "./calendar" })}
                  >
                    <Features name="Calendar" icon="calendar" />
                  </Pressable>
                  <Pressable
                      style={styles.featurePressable}
                      onPress={() => router.push({ pathname: "./courses" })}
                  >
                    <Features name="Courses" icon="graduation-cap" />
                  </Pressable>
                </ScrollView>
              </View>
            </View>

            <View style={styles.appointments}>
              <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
              >
                <Text style={[styles.h2, { color: "#148085" }]}>Appointments</Text>
                <Pressable onPress={() => router.push({ pathname: "./calendar" })}>
                  <Text style={[styles.h3, { color: "#02D6B6", fontWeight: "600" }]}>
                    See All
                  </Text>
                </Pressable>
              </View>
              <View>
                <FlatList
                    data={upcomingAppointments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <AppointmentCard
                            key={item.id}
                            id={item.id}
                            patientId={item.patientId}
                            status={item.status}
                            time={item.time.toString()}
                            type={item.type}
                            // No need to pass refreshAppointments
                        />
                    )}
                    ListEmptyComponent={
                      <Text style={styles.noAppointmentsText}>
                        No upcoming appointments.
                      </Text>
                    }
                />
              </View>
            </View>
          </View>

          {/* Floating Action Button */}
          <FAB
              style={styles.fab}
              icon="chat"
              onPress={() => setChatVisible(true)}
              color="#fff"
          />

          {/* Chat Modal */}
          <Portal>
            <Modal
                visible={chatVisible}
                onDismiss={() => {
                  setChatVisible(false);
                  setResponse("");
                }}
                contentContainerStyle={styles.chatContainer}
            >
              <View style={styles.chatHeader}>
                <Text style={styles.chatTitle}>Stitch Assistant</Text>
              </View>
              <View>
                <LinearGradient
                    colors={["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0)"]}
                    style={styles.featherTop}
                />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.responseContainer}
                >
                  {response ? (
                      <Markdown>{response}</Markdown>
                  ) : (
                      <Text style={styles.responseText}></Text>
                  )}
                </ScrollView>
                <LinearGradient
                    colors={["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]}
                    style={styles.featherBottom}
                />
              </View>

              <View style={styles.chatFooter}>
                <TextInput
                    outlineColor={"#02D6B6"}
                    activeOutlineColor={"#02D6B6"}
                    label="Ask a medical question"
                    value={question}
                    onChangeText={(text) => setQuestion(text)}
                    style={styles.chatInput}
                    mode="outlined"
                />
                <Button
                    mode="contained"
                    buttonColor={"#02D6B6"}
                    loading={loadingResponse}
                    onPress={() => {
                      if (question.trim() !== "") {
                        getChatGPTResponse(question);
                        setQuestion("");
                      }
                    }}
                    disabled={loadingResponse}
                    style={styles.sendButton}
                >
                  Send
                </Button>
              </View>
            </Modal>
          </Portal>
        </SafeAreaView>
      </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  banner: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  panel: {
    flex: 2.5,
    marginTop: 20,
    backgroundColor: "white",
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
  },
  profilePic: {
    flexDirection: "row",
    marginRight: 15,
    borderWidth: 2,
    height: 55,
    width: 55,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#02D6B6",
    borderRadius: 27.5,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  search: {
    flexDirection: "row",
    padding: 10,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#02D6B6",
    borderRadius: 15,
    width: "80%",
    height: 50,
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "#grey",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
  },
  features: {
    marginHorizontal: 40,
    marginTop: 20,
  },

  appointments: {
    marginHorizontal: 40,
    marginTop: 20,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  h1: {},
  h2: {
    fontSize: 25,
    fontWeight: "600",
  },
  h3: {
    fontSize: 15,
    fontWeight: "300",
    color: "#7D7D7D",
  },
  searchInput: {
    marginTop: 20,
    marginHorizontal: 40,
  },
  stitch: {
    position: "absolute",
    resizeMode: "contain",
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#02D6B6",
  },
  chatContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    maxHeight: Dimensions.get("window").height * 0.8,
  },
  chatHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#02D6B6",
  },
  chatBody: {
    flex: 1,
    marginBottom: 10,
  },
  responseContainer: {
    maxHeight: Dimensions.get("window").height * 0.4,
  },
  responseText: {
    fontSize: 16,
    color: "#000000",
  },
  chatFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatInput: {
    flex: 1,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: "center",
    marginTop: 7,
  },
  featherTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 30,
    zIndex: 1,
  },
  featherBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    zIndex: 1,
  },
  row: {
    flexDirection: "row",
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  featurePressable: {
    marginRight: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  featherEffect: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  noAppointmentsText: {
    textAlign: "center",
    color: "#7D7D7D",
    marginTop: 10,
  },
});

export default Dashboard;
