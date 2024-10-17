import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
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
import Markdown from "react-native-markdown-display";
import { LogBox } from "react-native";
LogBox.ignoreLogs(['Asyncstorage: ...']);
LogBox.ignoreAllLogs();

const { width } = Dimensions.get("window");

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
        setImageUrl(data.imageUrl);

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

          <ScrollView>
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
                <Image
                    source={{ uri: imageUrl as string }}
                    style={styles.postImage}
                />
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.sectionTitle}>Course Content</Title>
                <Markdown >
                  {courseData.courseContents}
                </Markdown>
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
          </ScrollView>
        </SafeAreaView>
      </Provider>
  );
};

export default CourseContents;

const markdownStyles = {
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: "#383838",
  },
  heading1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c2c2d",
    marginBottom: 10,
  },
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
  },
};

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
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#d8ebfe",
    padding: 10,
  },
  courseTitle: {
    fontSize: 20, // Reduced from 24
    fontWeight: "bold",
    color: "#2c2c2d",
    textAlign: "center",
  },
  courseBlurb: {
    fontSize: 14, // Reduced from 16
    marginTop: 5,
    color: "#383838",
    textAlign: "center", // Changed from alignSelf to textAlign
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c2c2d",
    marginBottom: 10,
    textAlign: "center",
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
    fontSize: 16,
    marginBottom: 10,
    color: "#666666",
  },
  postImage: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    marginVertical: 15,
  },
});
