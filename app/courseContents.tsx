// courseContents.tsx

import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  Alert,
  Pressable,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation, useRouter, useLocalSearchParams } from 'expo-router';
import { auth } from '@/firebaseConfig';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// Import Firestore functions
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

import StarRating from 'react-native-star-rating-widget';

const CourseContents = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { courseId } = useLocalSearchParams();

  // Ensure courseId is a string
  const courseIdStr = Array.isArray(courseId) ? courseId[0] : courseId;

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  const [courseData, setCourseData] = useState<any>(null);
  const [rating, setRating] = useState(0);

  const checkUserInAsyncStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        router.push({ pathname: './signIn' });
      }
    } catch (error) {
      console.error('Error retrieving user from AsyncStorage', error);
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
      console.error('Error fetching image from Firebase Storage', error);
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
      console.error('Error fetching image URL:', error);
    } finally {
      setLoadingImage(false);
    }
  };

  // Handle user sign-out
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await auth.signOut();
      Alert.alert('Success', 'You have been signed out.');
      router.replace({ pathname: './signIn' });
    } catch (error) {
      Alert.alert('Error', 'An error occurred while signing out.');
      console.error('Error signing out: ', error);
    }
  };

  // Fetch course data
  const fetchCourseData = async () => {
    try {
      if (!courseIdStr) {
        console.error('Invalid courseId');
        return;
      }
      const courseRef = doc(db, 'courses', courseIdStr);
      const courseDoc = await getDoc(courseRef);

      if (courseDoc.exists()) {
        const data = courseDoc.data();
        setCourseData(data);

        // Fetch existing rating from the 'ratings' subcollection
        if (user) {
          const ratingRef = doc(db, 'courses', courseIdStr, 'ratings', user.uid);
          const ratingDoc = await getDoc(ratingRef);
          if (ratingDoc.exists()) {
            const ratingData = ratingDoc.data();
            setRating(ratingData.rating);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  // Handle rating
  const handleRating = async (newRating: number) => {
    setRating(newRating);
    try {
      if (!user) {
        console.error('User is not logged in');
        return;
      }
      if (!courseIdStr) {
        console.error('Invalid courseId');
        return;
      }
      const ratingRef = doc(db, 'courses', courseIdStr, 'ratings', user.uid);
      await setDoc(ratingRef, {
        rating: newRating,
        userId: user.uid,
      });
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  // Retrieve user UID from AsyncStorage and fetch image URL
  useEffect(() => {
    checkUserInAsyncStorage();

    const fetchUserUid = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const userData = JSON.parse(userString);
          setUser(userData);
          await fetchImageUrl(userData);
          await fetchCourseData();
        } else {
          console.log('No user found');
          setLoadingImage(false);
        }
      } catch (error) {
        console.error('Error retrieving user from AsyncStorage', error);
        setLoadingImage(false);
      }
    };

    fetchUserUid();
  }, [user]); // Include 'user' in dependency array

  return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
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
        {courseData ? (
            <ScrollView style={{ padding: 20 }}>
              <Text style={styles.courseTitle}>{courseData.title}</Text>
              <Text style={styles.courseBlurb}>{courseData.blurb}</Text>
              {/* Add course content here */}
              <Text style={styles.sectionTitle}>Course Content</Text>
              {/* Example content */}
              <Text>{/* ... */}</Text>
              {/* Rating */}
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>Rate this course:</Text>
                <StarRating
                    rating={rating}
                    onChange={handleRating}
                    starSize={30}
                    color="#FF6231"
                />
              </View>
            </ScrollView>
        ) : (
            <ActivityIndicator size="large" color="#02D6B6" />
        )}
      </View>
  );
};

export default CourseContents;

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 10,
  },
  profilePic: {
    flexDirection: 'row',
    marginRight: 15,
    borderWidth: 2,
    height: 55,
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#02D6B6',
    borderRadius: 27.5,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 10,
  },
  courseBlurb: {
    fontSize: 16,
    color: '#7D7D7D',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 10,
  },
  ratingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#666666',
  },
});
