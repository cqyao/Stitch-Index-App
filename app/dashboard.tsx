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
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useNavigation, useRouter } from "expo-router";
import Input from '../components/SearchInput';
import { hp, wp } from '../helpers/common';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Features from "../components/Features";
import Appointment from "../components/Appointment";
import { auth } from "../firebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { User } from "firebase/auth";

const Dashboard = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(true); // Optional: Loading state for image

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
      setLoadingImage(false); // Optional: Update loading state
    }
  };

  // Handle user sign-out
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await auth.signOut();
      Alert.alert("Success", "You have been signed out.");
      router.navigate({ pathname: './signIn' });
    } catch (error) {
      Alert.alert("Error", "An error occurred while signing out.");
      console.error("Error signing out: ", error);
    }
  };

  // Retrieve user UID from AsyncStorage and fetch image URL
  useEffect(() => {
    const fetchUserUid = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          setUser(user);
          await fetchImageUrl(user);
        } else {
          console.log("No user found");
          setLoadingImage(false); // Optional: Update loading state
        }
      } catch (error) {
        console.error("Error retrieving user from AsyncStorage", error);
        setLoadingImage(false); // Optional: Update loading state
      }
    };

    fetchUserUid();
  }, []);

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.stitch}>
          <Image resizeMode="contain" source={require('../assets/images/backgroundimage.png')}/>
        </View>

        <View style={styles.banner}>
          <Text></Text>
          <TouchableOpacity style={styles.profilePic} onPress={handleSignOut}>
            {loadingImage ? (
                <ActivityIndicator size="small" color="#02D6B6" />
            ) : imageUrl ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.profileImage} // Define appropriate styles
                />
            ) : (
                <MaterialIcons name="face" size={40} color="black" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.panel}>
          <View style={styles.searchInput}>
            <Input
                placeholder='Search'
                onChangeText={() => { }}
            />
          </View>

          <View style={styles.features}>
            <Text style={[styles.h2, { color: "#148085" }]}>Features</Text>
            <View style={styles.row}>
              <ScrollView horizontal>
                <Pressable style={styles.featurePressable} onPress={() => router.push({ pathname: './patient' })}>
                  <Features name="My Patients" icon="user" />
                </Pressable>
                <Pressable style={styles.featurePressable} onPress={() => router.push({ pathname: './research' })}>
                  <Features name="Research" icon="book" />
                </Pressable>
                <Pressable style={styles.featurePressable} onPress={() => router.push({ pathname: "./calendar" })}>
                  <Features name="Calendar" icon="calendar" />
                </Pressable>
                <Pressable style={styles.featurePressable} onPress={() => router.push({ pathname: "./courses" })}>
                  <Features name="Courses" icon="graduation-cap" />
                </Pressable>
              </ScrollView>
            </View>
          </View>

          <View style={styles.appointments}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
              <Text style={[styles.h2, { color: "#148085" }]}>Appointments</Text>
              <Text style={[styles.h3, { color: "#02D6B6", fontWeight: "600" }]}>See All</Text>
            </View>
            <View>
              <Appointment date="Fri Nov 1" timeFrom={"8:30"} timeTo={"9:30"} />
            </View>
          </View>
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  banner: {
    flex: 1,
    flexDirection: 'row',
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
    borderRadius: 27.5, // Half of width/height for a circular shape
    overflow: 'hidden', // Ensure the image fits within the circle
    backgroundColor: "#fff", // Optional: Background color
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
    shadowColor: '#grey',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.2
  },
  features: {
    marginHorizontal: 40,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  appointments: {
    marginHorizontal: 40,
    marginTop: 20,

  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  h1: {

  },
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
    position: 'absolute',
    resizeMode: "contain",
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  featurePressable: {
    width: 150,
    paddingHorizontal: 2,
  }
})


export default Dashboard;
