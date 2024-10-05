import { View, Text, SafeAreaView, StyleSheet, ScrollView, Pressable, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from "react";
import Input from '../components/SearchInput'
import TagsInput from '../components/TagsInput'
import CourseComponent from '../components/CourseComponent'
import { Ionicons } from '@expo/vector-icons';
import { Link, useNavigation, useRouter } from "expo-router";
import { auth } from "@/firebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { User } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const courses = () => {

  // for determining whether "courses" or "my courses" is selected
  const [isSelected, setIsSelected] = useState(false);

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

        <View style={styles.searchInput}>
            <TagsInput/>
        </View>
        <View style={styles.textContainer}>
          <Pressable onPress={() => setIsSelected(true)}>
            <Text style={[styles.titleText, { color: isSelected ? '#FF6231' : '#D9D9D9' }]}>Find Courses</Text>
          </Pressable>
          <View style={styles.verticleLine}></View>
          <Pressable onPress={() => setIsSelected(false)}>
            <Text style={[styles.titleText, { color: isSelected ? '#D9D9D9' : '#FF6231' }]}>My Courses</Text>
          </Pressable>
        </View>
        {/* Courses */}
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={false} style={styles.courseContainer}>
          <CourseComponent tag="Anatomy" time="120" rating={4.5} title="Anatomy Basics" blurb="Go back to the basics, learn all about human anatomy!" userId="something" userPFP="something" name="Dr. Graham" price={50} buttonLabel="$50"/>
          <CourseComponent tag="Anatomy" time="1" rating={3.5} title="Anatomy Basics" blurb="Go back to the basics, learn all about human anatomy!" userId="something" userPFP="something" name="Dr. Graham" price={50} buttonLabel="Continue"/>
          <CourseComponent tag="Anatomy" time="1" rating={2.0} title="Anatomy Basics" blurb="Go back to the basics, learn all about human anatomy!" userId="something" userPFP="something" name="Dr. Graham" price={50} buttonLabel="Continue"/>
          <CourseComponent tag="Anatomy" time="1" rating={5} title="Anatomy Basics" blurb="Go back to the basics, learn all about human anatomy!" userId="something" userPFP="something" name="Dr. Graham" price={50} buttonLabel="Continue"/>
          <CourseComponent tag="Anatomy" time="1" rating={4.5} title="Anatomy Basics" blurb="Go back to the basics, learn all about human anatomy!" userId="something" userPFP="something" name="Dr. Graham" price={50} buttonLabel="Continue"/>
        </ScrollView>
        {/* Create Course Button */}
        <View>
          <Pressable style={styles.createButton} onPress={() => router.push({ pathname: './createCourse' })}>
            <Ionicons name="add-outline" size={50} color="#FF6231" />
          </Pressable>
        </View>
      </View>
    )
}

export default courses

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
    searchInput: {
      top: -20,
      marginHorizontal: 30,
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
    textContainer : {
      top: 15,
      justifyContent: "center",
      flexDirection: "row",
      gap: 10,
    },
    titleText : {
      fontFamily: "inter",
      fontWeight: "bold",
      fontSize: 25,
      color: "#FF6231",
      textAlign: "center",
    },
    verticleLine: {
      height: '100%',
      width: 2,
      backgroundColor: '#FF6231',
    },
    courseContainer: {
      top: 25,
    },
    createButton: {
      alignSelf: "center",
      bottom: 5,
      backgroundColor: "white",
      borderRadius: 12,
      borderColor: "#FF6231",
      borderWidth: 2,
    }
})