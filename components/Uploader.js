import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from "@/firebaseConfig";  // Ensure correct path to your firebaseConfig.js
import { ref, uploadBytes } from "firebase/storage";  // Import from modular Firebase SDK

const UploadScreen = () => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.canceled) {
            const source = {uri: result.assets[0].uri};
            console.log(source);
            setImage(source);
        }
    };

    const uploadImage = async () => {
        if (image) {
            setUploading(true);
            try {
                const response = await fetch(image.uri);
                const blob = await response.blob();
                const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);

                // Create a reference to the file location in Firebase storage
                const storageRef = ref(storage, `pfp/${filename}`);

                // Upload the file
                await uploadBytes(storageRef, blob);

                Alert.alert('Photo uploaded!');
            } catch (e) {
                console.log(e);
            } finally {
                setUploading(false);
                setImage(null);
            }
        } else {
            Alert.alert('No image selected');
        }
    };

    return (
        <SafeAreaView>
            <TouchableOpacity onPress={pickImage}>
                <Text>Pick an Image</Text>
            </TouchableOpacity>
            <View>
                {image && <Image source={{ uri: image.uri }} style={{ width: 300, height: 300 }} />}
                <TouchableOpacity onPress={uploadImage}>
                    <Text>Upload Image</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default UploadScreen;
