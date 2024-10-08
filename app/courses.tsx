import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import TagsInput from "../components/TagsInput";
import CourseComponent from "../components/CourseComponent";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

// Import Firestore functions
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  getDocs,
  arrayUnion,
  query,
  where,
  documentId,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import LottieView from "lottie-react-native";
import {AnimatedView} from "react-native-reanimated/lib/typescript/reanimated2/component/View";

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
  // State variables
  const [isSelected, setIsSelected] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);

  // New loading state variables
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [purchasedCoursesLoading, setPurchasedCoursesLoading] = useState(true);

  const router = useRouter();
  const navigation = useNavigation();

  // Check if user is logged in
  const checkUserInAsyncStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        router.push({ pathname: "./signIn" });
      }
    } catch (error) {
      console.error("Error retrieving user from AsyncStorage", error);
    }
  };

  // Fetch image URL from Firebase Storage
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

  // Fetch and set user's profile image URL
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

  // Helper function to fetch ratings for a course
  const getCourseRatings = async (courseId: string): Promise<{ userId: string; rating: number }[]> => {
    const ratingsArray: { userId: string; rating: number }[] = [];
    try {
      const ratingsRef = collection(db, "courses", courseId, "ratings");
      const ratingsSnapshot = await getDocs(ratingsRef);
      ratingsSnapshot.forEach((ratingDoc) => {
        const ratingData = ratingDoc.data();
        ratingsArray.push({ userId: ratingData.userId, rating: ratingData.rating });
      });
    } catch (error) {
      console.error(`Error fetching ratings for course ${courseId}:`, error);
    }
    return ratingsArray;
  };

  // Fetch courses from Firestore in real-time
  const fetchCourses = () => {
    setCoursesLoading(true); // Start loading courses
    const coursesRef = collection(db, "courses");
    const unsubscribe = onSnapshot(
        coursesRef,
        async (snapshot) => {
          const coursePromises = snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const courseId = doc.id;
            const ratingsArray = await getCourseRatings(courseId);

            return {
              id: courseId,
              ...data,
              ratings: ratingsArray,
              rating: calculateAverageRating(ratingsArray),
            } as Course;
          });

          const resolvedCourses = await Promise.all(coursePromises);
          setCourses(resolvedCourses);
          setCoursesLoading(false); // Courses are loaded
        },
        (error) => {
          console.error("Error fetching courses:", error);
          setCoursesLoading(false); // Stop loading on error
        }
    );

    return unsubscribe;
  };

  // Fetch user's purchased courses from Firestore in real-time
  const fetchPurchasedCourses = (userId: string) => {
    setPurchasedCoursesLoading(true); // Start loading purchased courses
    const userRef = doc(db, "Users", userId);
    const unsubscribe = onSnapshot(
        userRef,
        async (userDoc) => {
          if (userDoc.exists()) {
            const purchasedCourseIds = userDoc.data().purchasedCourses || [];

            if (purchasedCourseIds.length > 0) {
              const coursesQuery = query(
                  collection(db, "courses"),
                  where(documentId(), "in", purchasedCourseIds)
              );

              onSnapshot(
                  coursesQuery,
                  async (querySnapshot) => {
                    const coursePromises = querySnapshot.docs.map(async (doc) => {
                      const data = doc.data();
                      const courseId = doc.id;
                      const ratingsArray = await getCourseRatings(courseId);

                      return {
                        id: courseId,
                        ...data,
                        ratings: ratingsArray,
                        rating: calculateAverageRating(ratingsArray),
                      } as Course;
                    });

                    const resolvedCourses = await Promise.all(coursePromises);
                    setPurchasedCourses(resolvedCourses);
                    setPurchasedCoursesLoading(false); // Purchased courses are loaded
                  },
                  (error) => {
                    console.error("Error fetching purchased courses:", error);
                    setPurchasedCoursesLoading(false); // Stop loading on error
                  }
              );
            } else {
              setPurchasedCourses([]);
              setPurchasedCoursesLoading(false); // No purchased courses to load
            }
          } else {
            setPurchasedCoursesLoading(false); // User document does not exist
          }
        },
        (error) => {
          console.error("Error fetching user document:", error);
          setPurchasedCoursesLoading(false); // Stop loading on error
        }
    );

    return unsubscribe;
  };

  // Calculate average rating
  const calculateAverageRating = (ratingsArray: { userId: string; rating: number }[]) => {
    if (!ratingsArray || ratingsArray.length === 0) return 0;
    const total = ratingsArray.reduce((sum, r) => sum + r.rating, 0);
    return total / ratingsArray.length;
  };

  // Handle course purchase
  const handlePurchaseCourse = async (course: Course) => {
    try {
      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const userRef = doc(db, "Users", user.uid);
      await setDoc(
          userRef,
          {
            purchasedCourses: arrayUnion(course.id),
          },
          { merge: true }
      );

      Alert.alert("Success", "Course purchased successfully");
    } catch (error) {
      console.error("Error purchasing course:", error);
      Alert.alert("Error", "Failed to purchase course");
    }
  };

  // Handle course press
  const handleCoursePress = (course: Course) => {
    router.push({
      pathname: "./courseContents",
      params: { courseId: course.id },
    });
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

          // Set up real-time listeners
          const unsubscribeCourses = fetchCourses();
          const unsubscribePurchasedCourses = fetchPurchasedCourses(user.uid);

          // Cleanup function to unsubscribe
          return () => {
            if (unsubscribeCourses) unsubscribeCourses();
            if (unsubscribePurchasedCourses) unsubscribePurchasedCourses();
          };
        } else {
          console.log("No user found");
          setLoadingImage(false);
        }
      } catch (error) {
        console.error("Error retrieving user from AsyncStorage", error);
        setLoadingImage(false);
      }
    };

    // Call the async function and store the cleanup if applicable
    let unsubscribe: (() => void) | undefined;
    fetchUserUid().then((cleanup) => {
      if (cleanup) {
        unsubscribe = cleanup;
      }
    });

    // Cleanup when component unmounts
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Determine overall loading state
  const loading = coursesLoading || purchasedCoursesLoading;

  if (loading) {
    // Render loading screen
    return (
        <Animated.View exiting={FadeOut} style={styles.loadingContainer}>
          <LottieView
              source={require("../assets/Animations/loading.json")}
              autoPlay
              loop
              style={styles.lottie}
          />
        </Animated.View>
    );
  }

  return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {/* Header */}
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

        {/* Search and Tags */}
        <View style={styles.searchInput}>
          <TagsInput />
        </View>

        {/* Toggle between "Find Courses" and "My Courses" */}
        <View style={styles.textContainer}>
          <Pressable onPress={() => setIsSelected(true)}>
            <Text
                style={[
                  styles.titleText,
                  { color: isSelected ? "#FF6231" : "#D9D9D9" },
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
                  { color: isSelected ? "#D9D9D9" : "#FF6231" },
                ]}
            >
              My Courses
            </Text>
          </Pressable>
        </View>

        {/* Courses List */}
        <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={false}
            style={styles.courseContainer}
        >
          {(isSelected ? courses : purchasedCourses).map((course) => (
              <Animated.View exiting={FadeOut} entering={FadeIn} >
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
                  buttonLabel={isSelected ? `$${course.price}` : "Continue"}
                  onPress={() =>
                      isSelected
                          ? handlePurchaseCourse(course)
                          : handleCoursePress(course)
                  }
              />
                </Animated.View>
          ))}
        </ScrollView>

        {/* Create Course Button */}
        <View>
          <Pressable
              style={styles.createButton}
              onPress={() => router.push({ pathname: "./createCourse" })}
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
    borderRadius: 27.5,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  textContainer: {
    top: 15,
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  titleText: {
    fontFamily: "inter",
    fontWeight: "bold",
    fontSize: 25,
    color: "#FF6231",
    textAlign: "center",
  },
  verticleLine: {
    height: "100%",
    width: 2,
    backgroundColor: "#FF6231",
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  lottie: {
    width: 150,
    height: 150,
  }
});
