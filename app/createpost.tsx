import React, {useEffect, useState} from 'react';
import {Button, Image, Pressable, StyleSheet, Text, TextInput, View, } from 'react-native';
import {db, storage} from '../firebaseConfig';
import {addDoc, collection, Timestamp} from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router'


const CreatePost = ({ }) => {
    const [ title, setTitle ] = useState('');
    const [ content, setContent ] = useState('');
    const [ user, setUser ] = useState(null);
    const [ author, setAuthor ] = useState<string | null>(null);
    

    const getAuthorFromAsyncStorage = async () => {
        try {
            const userString = await AsyncStorage.getItem('user');
            if (userString) {
                const userData = JSON.parse(userString);
                setAuthor(`${userData.firstName} ${userData.lastName}`);
            }
        } catch (error) {
            console.error('Error fetching author data from AsyncStorage', error);
        }
    };

    useEffect(() => {
        getAuthorFromAsyncStorage();
    }, [])

    useEffect(() => {
        const getUser = async () => {
            const userData = await fetchUserFromAsyncStorage();
            if (userData) {
                setUser(userData);
            }
        };
        getUser();
    }, []);

    const fetchUserFromAsyncStorage = async () => {
        try {
            const userString = await AsyncStorage.getItem('user');
            if (userString) {
                return JSON.parse(userString); // Returns an object that contains firstName, lastName, etc.
            }
            return null;
        } catch (error) {
            console.error('Error retrieving user from AsyncStorage', error);
            return null;
        }
    };

    // For image uploading
    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        try {
            let imageUrl = '';
            if (image) {
                // Upload image to Firebase Storage
                const response = await fetch(image);
                const blob = await response.blob();
                const imageRef = ref(storage, `postImages/${Date.now()}`);
                await uploadBytes(imageRef, blob);
                imageUrl = await getDownloadURL(imageRef);
            }

            await addDoc(collection(db, 'posts'), {
                author: author, // Replace with actual user data
                title,
                content,
                timestamp: Timestamp.now(),
                imageUrl,
            });

            // Clear form
            setTitle('');
            setContent('');
            setImage(null);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <View style={styles.modalContent}>
            <Text style={styles.heading}>Create a New Post</Text>
            <TextInput
                style={styles.input}
                placeholder="Post Title"
                value={title}
                onChangeText={(text) => setTitle(text)}
            />
            <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="What's on your mind?"
                value={content}
                onChangeText={(text) => setContent(text)}
                multiline
            />
            <Pressable style={styles.imagePicker} onPress={pickImage}>
                <Text style={styles.imagePickerText}>Pick an Image</Text>
            </Pressable>
            {image && <Image source={{ uri: image }} style={styles.previewImage} />}
            <Button title="Post" onPress={handleSubmit} />
            <Button title="Cancel" onPress={router.back} />
        </View>
    );
};

export default CreatePost;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'white',
        margin: 30,
        borderRadius: 10,
        
    },
    modalContent: {
        flex: 1,
        backgroundColor: "#F9F9F9",
        borderRadius: 10,
        padding: 30,
        marginHorizontal: 20,
        marginTop: 60,
        marginBottom: 95,
      },
    heading: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 15,
    },
    input: {
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    imagePicker: {
        backgroundColor: '#00D6B5',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    imagePickerText: {
        color: 'white',
        textAlign: 'center',
    },
    previewImage: {
        width: '100%',
        height: 200,
        marginBottom: 15,
    },
});