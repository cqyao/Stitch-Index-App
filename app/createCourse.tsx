// createCourse.tsx

import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  Alert,
  Pressable,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { auth } from "@/firebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

// Import Firestore functions
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { FirebaseError } from "firebase/app";

const CreateCourse = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  // State for form inputs
  const [title, setTitle] = useState("");
  const [blurb, setBlurb] = useState("");
  const [tag, setTag] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");

  const checkUserInAsyncStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        router.push({ pathname: "./signIn" });
      }
    } catch (error) {
      console.error("Error retrieving user from AsyncStorage", error);
    }
    setLoading(false);
  };

  // Function to fetch image URL from Firebase Storage
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

  // Handle course creation
  const handleCreateCourse = async () => {
    try {
      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      if (!title || !blurb || !tag || !time || !price) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      const newCourse = {
        title,
        blurb,
        tag,
        time,
        price: parseFloat(price),
        rating: 0, // Initial rating
        ratings: [], // Empty ratings array
        userId: user.uid,
        userPFP: imageUrl || "",
        name: user.displayName || "Anonymous",
      };

      await addDoc(collection(db, "courses"), newCourse);
      Alert.alert("Success", "Course created successfully");
      router.back();
    } catch (error) {
      console.error("Error creating course:", error);
      Alert.alert("Error", "Failed to create course");
    }
  };

  // Retrieve user UID from AsyncStorage and fetch image URL
  useEffect(() => {
    checkUserInAsyncStorage();

    const fetchUserUid = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          setUser(user);
          await fetchImageUrl(user);
        } else {
          console.log("No user found");
          setLoadingImage(false);
        }
      } catch (error) {
        console.error("Error retrieving user from AsyncStorage", error);
        setLoadingImage(false);
      }
    };

    fetchUserUid();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.banner}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={35} color="black" />
        </Pressable>
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
      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Course Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Blurb"
          value={blurb}
          onChangeText={setBlurb}
        />
        <TextInput
          style={styles.input}
          placeholder="Tag"
          value={tag}
          onChangeText={setTag}
        />
        <TextInput
          style={styles.input}
          placeholder="Time (minutes)"
          value={time}
          onChangeText={setTime}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <Button title="Create Course" onPress={handleCreateCourse} />
      </View>
    </View>
  );
};

export default CreateCourse;

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 10,
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
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  form: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
});
