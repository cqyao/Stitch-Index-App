import React, { useEffect, useState } from "react";
import {Text, View, ActivityIndicator, Alert, Pressable, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Link, useNavigation, useRouter } from "expo-router";
import { auth } from "@/firebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { User } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
const createCourse = () => {

  const router = useRouter();
  const navigation = useNavigation();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(true); // Optional: Loading state for image
  const [loading, setLoading] = useState(true);


  const checkUserInAsyncStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        // setUser(JSON.parse(storedUser));
        router.push({ pathname: "./signIn" });
      }
    } catch (error) {
      console.error("Error retrieving user from AsyncStorage", error);
    }
    setLoading(false);
  };


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
      router.replace({ pathname: './signIn' }); // Use replace instead of push
    } catch (error) {
      Alert.alert("Error", "An error occurred while signing out.");
      console.error("Error signing out: ", error);
    }
  };

  // Retrieve user UID from AsyncStorage and fetch image URL
  useEffect(() => {

    checkUserInAsyncStorage();

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
    <View style={{flex: 1,backgroundColor: 'white'}}>
        <View style={styles.banner}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={35} color="black" />
          </Pressable>
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
    </View>
  );
};
export default createCourse;

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
      borderRadius: 27.5, // Half of width/height for a circular shape
      overflow: 'hidden', // Ensure the image fits within the circle
      backgroundColor: "#fff", // Optional: Background color
    },
    profileImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
})