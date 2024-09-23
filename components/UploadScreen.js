import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from "@/firebaseConfig";  // Ensure correct path to your firebaseConfig.js
import { ref, uploadBytes } from "firebase/storage";  // Import from modular Firebase SDK
import { getDownloadURL } from 'firebase/storage'; // Make sure to import getDownloadURL

// Function to upload an image to Firebase
export const uploadImage = async (image, uid) => {
    if (image) {
        try {
            const response = await fetch(image.uri);
            const blob = await response.blob();
            const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);

            // Create a reference to the file location in Firebase storage
            const storageRef = ref(storage, `pfp/${uid}`);

            // Upload the file
            await uploadBytes(storageRef, blob);

            // Get the download URL
            const downloadURL = await getDownloadURL(storageRef);

            Alert.alert('Photo uploaded!');

            // Return the download URL
            return downloadURL;
        } catch (e) {
            console.log(e);
            Alert.alert('Upload failed');
        }
    } else {
        Alert.alert('No image selected');
    }
};

export const pickImage = async (uid) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1
    });

    if (!result.canceled) {
        const source = { uri: result.assets[0].uri };
        console.log(source);

        // Call uploadImage immediately after picking and get the download URL
        const downloadURL = await uploadImage(source, uid);

        // Return the download URL
        return downloadURL;
    }
};

// Main UploadScreen component
const UploadScreen = () => {
    const [image, setImage] = useState(null);

    const handlePickAndUploadImage = async () => {
        await pickImage(uploadImage);
    };

    return (
        <SafeAreaView>
            <TouchableOpacity onPress={handlePickAndUploadImage}>
                <Text>Pick and Upload an Image</Text>
            </TouchableOpacity>
            <View>
                {image && <Image source={{ uri: image.uri }} style={{ width: 300, height: 300 }} />}
            </View>
        </SafeAreaView>
    );
};

export default UploadScreen;
