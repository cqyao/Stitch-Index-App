import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from "@/firebaseConfig";  // Ensure correct path to your firebaseConfig.js
import { ref, uploadBytes } from "firebase/storage";  // Import from modular Firebase SDK

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

            Alert.alert('Photo uploaded!');
        } catch (e) {
            console.log(e);
            Alert.alert('Upload failed');
        }
    } else {
        Alert.alert('No image selected');
    }
};

// Function to pick an image from the library and upload it
export const pickImage = async (uid) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1
    });

    if (!result.canceled) {
        const source = { uri: result.assets[0].uri };
        console.log(source);

        // Call uploadImage immediately after picking
        await uploadImage(source, uid);
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
