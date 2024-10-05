// courses.tsx

import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Input from '../components/SearchInput';
import TagsInput from '../components/TagsInput';
import CourseComponent from '../components/CourseComponent';
import { Ionicons } from '@expo/vector-icons';
import { Link, useNavigation, useRouter } from 'expo-router';
import { auth } from '@/firebaseConfig';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

// Import Firestore functions
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  documentId, setDoc,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig'; // Adjust the path as necessary

interface Course {
  id: string;
  tag: string;
  time: string;
  rating: number;
  title: string;
  blurb: string;
  userId: string;
  userPFP: string;
  name: string;
  price: number;
  ratings: { userId: string; rating: number }[];
}

const Courses = () => {
  // for determining whether "Find Courses" or "My Courses" is selected
  const [isSelected, setIsSelected] = useState(true);

  const router = useRouter();
  const navigation = useNavigation();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  // State for courses
  const [courses, setCourses] = useState<Course[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);

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

  // Fetch courses from Firestore
  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const coursesData: Course[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        coursesData.push({
          id: doc.id,
          ...data,
          rating: calculateAverageRating(data.ratings || []),
        } as Course);
      });
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Calculate average rating
  const calculateAverageRating = (ratings: { userId: string; rating: number }[]) => {
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    return total / ratings.length;
  };

  // Fetch user's purchased courses
  const fetchPurchasedCourses = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const purchasedCourseIds = userDoc.data().purchasedCourses || [];

        if (purchasedCourseIds.length > 0) {
          const coursesQuery = query(
              collection(db, 'courses'),
              where(documentId(), 'in', purchasedCourseIds)
          );

          const querySnapshot = await getDocs(coursesQuery);
          const coursesData: Course[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            coursesData.push({
              id: doc.id,
              ...data,
              rating: calculateAverageRating(data.ratings || []),
            } as Course);
          });
          setPurchasedCourses(coursesData);
        } else {
          setPurchasedCourses([]);
        }
      }
    } catch (error) {
      console.error('Error fetching purchased courses:', error);
    }
  };

  // Handle course purchase
  const handlePurchaseCourse = async (course: Course) => {
    try {
      if (!user) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      await setDoc(
          userRef,
          {
            purchasedCourses: arrayUnion(course.id),
          },
          { merge: true }
      );

      Alert.alert('Success', 'Course purchased successfully');
      fetchPurchasedCourses(user.uid); // Refresh purchased courses
    } catch (error) {
      console.error('Error purchasing course:', error);
      Alert.alert('Error', 'Failed to purchase course');
    }
  };

  // Handle course press
  const handleCoursePress = (course: Course) => {
    router.push({
      pathname: './courseContents',
      params: { courseId: course.id },
    });
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
          await fetchCourses();
          await fetchPurchasedCourses(user.uid);
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
  }, []);

  return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.banner}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={35} color="black" />
          </Pressable>
          <TouchableOpacity style={styles.profilePic}>
            {loadingImage ? (
                <ActivityIndicator size="small" color="#02D6B6" />
            ) : imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.profileImage} />
            ) : (
                <MaterialIcons name="face" size={40} color="black" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.searchInput}>
          <TagsInput />
        </View>
        <View style={styles.textContainer}>
          <Pressable onPress={() => setIsSelected(true)}>
            <Text
                style={[
                  styles.titleText,
                  { color: isSelected ? '#FF6231' : '#D9D9D9' },
                ]}
            >
              Find Courses
            </Text>
          </Pressable>
          <View style={styles.verticleLine}></View>
          <Pressable onPress={() => setIsSelected(false)}>
            <Text
                style={[
                  styles.titleText,
                  { color: isSelected ? '#D9D9D9' : '#FF6231' },
                ]}
            >
              My Courses
            </Text>
          </Pressable>
        </View>
        {/* Courses */}
        <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={false}
            style={styles.courseContainer}
        >
          {(isSelected ? courses : purchasedCourses).map((course) => (
              <CourseComponent
                  key={course.id}
                  tag={course.tag}
                  time={course.time}
                  rating={course.rating}
                  title={course.title}
                  blurb={course.blurb}
                  userId={course.userId}
                  userPFP={course.userPFP}
                  name={course.name}
                  price={course.price}
                  buttonLabel={
                    isSelected ? `$${course.price}` : 'Continue'
                  }
                  onPress={() =>
                      isSelected
                          ? handlePurchaseCourse(course)
                          : handleCoursePress(course)
                  }
              />
          ))}
        </ScrollView>
        {/* Create Course Button */}
        <View>
          <Pressable
              style={styles.createButton}
              onPress={() => router.push({ pathname: './createCourse' })}
          >
            <Ionicons name="add-outline" size={50} color="#FF6231" />
          </Pressable>
        </View>
      </View>
  );
};

export default Courses;

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  textContainer: {
    top: 15,
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  titleText: {
    fontFamily: 'inter',
    fontWeight: 'bold',
    fontSize: 25,
    color: '#FF6231',
    textAlign: 'center',
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
    alignSelf: 'center',
    bottom: 5,
    backgroundColor: 'white',
    borderRadius: 12,
    borderColor: '#FF6231',
    borderWidth: 2,
  },
});
