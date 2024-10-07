import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { storage } from "@/firebaseConfig"; // Ensure correct path to your firebaseConfig.js
import { ref, uploadBytes } from "firebase/storage"; // Import from modular Firebase SDK
import { getDownloadURL } from "firebase/storage"; // Make sure to import getDownloadURL

// Set an upload limit
const MB = 50; // Limit in megabytes
const MAX_IMAGE_SIZE = MB * 1024 * 1024; //  MB in bytes

// Function to upload an image to Firebase
export const uploadImage = async (image, uid) => {
  if (image) {
    try {
      const response = await fetch(image.uri);
      const blob = await response.blob();

      // Create a reference to the file location in Firebase storage
      const storageRef = ref(storage, `pfp/${uid}`);

      // Upload the file
      await uploadBytes(storageRef, blob);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      if (image.uri !== "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg") Alert.alert("Photo uploaded!");

      // Return the download URL
      return downloadURL;
    } catch (e) {
      console.log(e);
      Alert.alert("Upload failed");
    }
  } else {
    Alert.alert("No image selected");
  }
};

// Function to pick an image from the library and upload it
export const pickImage = async (uid) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    const source = { uri: result.assets[0].uri };
    const fileSize = result.assets[0].fileSize; // Get the file size in bytes

    if (fileSize && fileSize > MAX_IMAGE_SIZE) {
      Alert.alert(
        "Error",
        `Image size exceeds the limit of ${MB} MB. Please choose a smaller image.`
      );
      return null; // Stop the process if the image is too large
    }

    console.log(source);

    // Call uploadImage immediately after picking and get the download URL
    const downloadURL = await uploadImage(source, uid);

    // Return the download URL
    console.log(downloadURL);
    return downloadURL;
  }
};

// Main UploadScreen component
const UploadScreen = () => {
  const [image, setImage] = useState(null);

  const handlePickAndUploadImage = async () => {
    await pickImage(uploadImage);
  };
};

export default UploadScreen;
