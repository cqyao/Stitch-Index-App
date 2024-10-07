import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import Animated, { FadeIn } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PatientProps } from "@/components/PatientInfo";
import { FirebaseError } from "firebase/app";

const Appointment = () => {
  const params = useLocalSearchParams<{
    patientId: string;
    time: string;
    type: string;
    data: string;
  }>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ patientUrl, setPatientUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const patientData: PatientProps = params.data
    ? JSON.parse(params.data)
    : null;

  const fetchImageUrl = async (userID: string) => {
    try {
      const url = await fetchImageFromFirebase(`pfp/${userID}`);
      if (url) {
        setImageUrl(url);
      }
    } catch (error) {
      console.error("Error fetching image URL: ", error);
    }
  };

  const fetchPatientImageUrl = async (patientID: string) => {
    try {
      const url = await fetchImageFromFirebase(`pfp/${patientID}.jpg`);
      if (url) {
        setPatientUrl(url);
      }
    } catch (error) {
      console.error("Error fetching patient URL: ", error);
    }
  };

  const fetchImageFromFirebase = async (
    path: string
  ): Promise<string | null> => {
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

  // Fetch userId from AsyncStorage
  useEffect(() => {
    const getUserIdFromAsyncStorage = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const userData = JSON.parse(userString);
          setUserId(userData.uid);
          await fetchImageUrl(userData.uid);
        }
      } catch (error) {
        console.error("Error fetching user ID from AsyncStorage", error);
      }
    };

    getUserIdFromAsyncStorage();
  }, []);

  useEffect(() => {
    const getPatientImage = async () => {
      try {
        await fetchPatientImageUrl(params.patientId);
      } catch (error) {
        console.error("Error fetching patient image: ", error);
      };
    } 
    getPatientImage();
  }, [])

  return (
    <View style={styles.screen}>
      <View style={styles.banner}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={35} color="white" />
        </Pressable>
        <Image
          source={require("../assets/images/LogoWhite.png")}
          resizeMode="contain"
          style={styles.logo}
        />
        <Animated.Image
          entering={FadeIn.delay(500)}
          source={{ uri: imageUrl || undefined }}
          style={{ height: 45, width: 45, borderRadius: 90 }}
        />
      </View>
      <View style={styles.card}>
        <View style={styles.time}>
          <FontAwesome5 name="clock" size={20} color="grey" />
          <Text style={styles.timeText}>{params.time}</Text>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.profileView}>
          <Animated.Image
            entering={FadeIn.delay(500)}
            source={{ uri: patientUrl || undefined }}
            style={styles.profilePic}
          />
          <View>
            <Text style={styles.profileName}>{patientData.name}</Text>
            <Text style={styles.profileType}>{params.type}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.h1}>Symptoms</Text>
          {patientData.symptoms.map((symptom) => (
            <Text key={symptom} style={styles.h2}>
              {symptom}
            </Text>
          ))}
        </View>
        <View style={{ marginVertical: 10 }} />
        <View>
          <Text style={styles.h1}>Meeting Type</Text>
          <Text style={styles.h2}>Online</Text>
        </View>
        <View style={styles.lineStyle} />
      </View>
    </View>
  );
};

export default Appointment;

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: "#00D6B5",
  },
  logo: {
    width: 200,
    height: 70,
  },
  screen: {
    backgroundColor: "#F2F2F2",
    //paddingHorizontal: 30,
  },
  card: {
    backgroundColor: "white",
    alignSelf: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    height: 500,
    width: "85%",
    shadowColor: "grey",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  time: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 15,
    marginLeft: 10,
    color: "grey",
  },
  lineStyle: {
    borderBottomColor: "#00D6B5",
    borderBottomWidth: 1,
    width: "95%",
    alignSelf: "center",
    marginVertical: 15,
  },
  h2: {
    marginTop: 5,
    fontSize: 15,
  },
  h1: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profilePic: {
    borderRadius: 90,
    height: 70,
    width: 70,
    borderColor: "#00D6B5",
    borderWidth: 1,
  },
  profileView: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 20,
  },
  profileType: {
    fontSize: 18,
    fontWeight: "300",
    marginLeft: 20,
    color: "grey",
  },
});
