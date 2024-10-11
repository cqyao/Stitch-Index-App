import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Provider,
} from "react-native-paper";
import {
  useNavigation,
  useRouter,
  useLocalSearchParams,
} from "expo-router";
import { auth } from "@/firebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import LottieView from "lottie-react-native";

// Import Firestore functions
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

import StarRating from "react-native-star-rating-widget";

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
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        router.push({ pathname: "./signIn" });
      }
    } catch (error) {
      console.error("Error retrieving user from AsyncStorage", error);
    }
    setLoading(false);
  };

  // Function to fetch image URL from Firebase Storage
  const fetchImageFromFirebase = async (
      path: string
  ): Promise<string | null> => {
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
      setLoadingImage(false);
    }
  };

  // Fetch course data
  const fetchCourseData = async () => {
    try {
      if (!courseIdStr) {
        console.error("Invalid courseId");
        return;
      }
      const courseRef = doc(db, "courses", courseIdStr);
      const courseDoc = await getDoc(courseRef);

      if (courseDoc.exists()) {
        const data = courseDoc.data();
        setCourseData(data);

        // Fetch existing rating from the 'ratings' subcollection
        if (user) {
          const ratingRef = doc(
              db,
              "courses",
              courseIdStr,
              "ratings",
              user.uid
          );
          const ratingDoc = await getDoc(ratingRef);
          if (ratingDoc.exists()) {
            const ratingData = ratingDoc.data();
            setRating(ratingData.rating);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  // Handle rating
  const handleRating = async (newRating: number) => {
    setRating(newRating);
    try {
      if (!user) {
        console.error("User is not logged in");
        return;
      }
      if (!courseIdStr) {
        console.error("Invalid courseId");
        return;
      }
      const ratingRef = doc(db, "courses", courseIdStr, "ratings", user.uid);
      await setDoc(ratingRef, {
        rating: newRating,
        userId: user.uid,
      });
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  // Retrieve user UID from AsyncStorage and fetch image URL
  useEffect(() => {
    checkUserInAsyncStorage();

    const fetchUserUid = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const userData = JSON.parse(userString);
          setUser(userData);
          await fetchImageUrl(userData);
          await fetchCourseData();
        } else {
          console.log("No user found");
          setLoadingImage(false);
        }
      } catch (error) {
        console.error("Error retrieving user from AsyncStorage", error);
        setLoadingImage(false);
      }
    };

    fetchUserUid();
  }, [user]); // Include 'user' in dependency array

  if (!courseData) {
    return (
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <LottieView
                source={require("../assets/Animations/loading.json")}
                autoPlay
                loop
                style={styles.lottie}
            />
          </View>
        </SafeAreaView>
    );
  }

  return (
      <Provider>
        <SafeAreaView style={styles.container}>
          {/* Banner */}
          <View style={styles.banner}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={35} color="white" />
            </Pressable>
            <View style={styles.logoContainer}>
              <Image
                  source={require("../assets/images/LogoWhite.png")}
                  resizeMode="contain"
                  style={styles.logo}
              />
            </View>
          </View>
          {/* End of Banner */}

          <Animated.ScrollView entering={FadeIn.delay(100)}>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.courseTitle}>{courseData.title}</Title>
                <Paragraph style={styles.courseBlurb}>
                  {courseData.blurb}
                </Paragraph>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.sectionTitle}>Course Content</Title>
                <Paragraph>{courseData.courseContents}</Paragraph>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Image source={{ uri: imageUrl as string }} style={styles.postImage} />
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.ratingContainer}>
                  <Paragraph style={styles.ratingText}>
                    Rate this course:
                  </Paragraph>
                  <StarRating
                      rating={rating}
                      onChange={handleRating}
                      starSize={30}
                      color="#FF6231"
                  />
                </View>
              </Card.Content>
            </Card>
          </Animated.ScrollView>
        </SafeAreaView>
      </Provider>
  );
};

export default CourseContents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: "#00D6B5",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 50,
  },
  card: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#d8ebfe",
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c2c2d",
    textAlign: "center",
  },
  courseBlurb: {
    fontSize: 16,
    marginTop: 5,
    color: "#383838",
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c2c2d",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: 200,
    height: 200,
  },
  ratingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  ratingText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#666666",
  },
  postImage: {
    width: "100%",
    height: 300,
    borderRadius: 15,
    marginVertical: 15,
  },
});
