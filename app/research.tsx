import React, {useEffect, useState} from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebaseConfig";
import ResearchPost from "../components/ResearchPost";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { AnimatedFAB } from 'react-native-paper';

const Research = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isExtended, setIsExtended] = useState(true); // State to manage FAB extension

  // Animate FAB on scroll
  const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  const fetchImageUrl = async (userID: string) => {
    try {
      const url = await fetchImageFromFirebase(`pfp/${userID}`);
      if (url) {
        setImageUrl(url);
      }
    } catch (error) {
      console.error("Error fetching image URL:", error);
    }
  };

  const fetchImageFromFirebase = async (path: string): Promise<string | null> => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, path);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error("Error fetching image from Firebase Storage", error);
      return null;
    }
  };

  // Fetch userId from AsyncStorage
  useEffect(() => {
    const getUserIdFromAsyncStorage = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const userData = JSON.parse(userString);
          setUserId(userData.uid);
          await fetchImageUrl(userData.uid);
        }
      } catch (error) {
        console.error("Error fetching user ID from AsyncStorage", error);
      }
    };

    getUserIdFromAsyncStorage();
  }, []);

  // Fetch posts from Firestore
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
      setLoading(false);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
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
      <View style={styles.container}>
        {/* Banner */}
        <View style={styles.banner}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={35} color="white" />
          </Pressable>
          <Image
              source={require("../assets/images/LogoWhite.png")}
              resizeMode="contain"
              style={styles.logo}
          />
          <Animated.Image
              entering={FadeIn.delay(500)}
              source={{ uri: imageUrl || undefined }}
              style={{ height: 45, width: 45, borderRadius: 90 }}
          />
        </View>
        {/* End banner */}

        <Animated.ScrollView onScroll={onScroll} entering={FadeIn.delay(500)} scrollEventThrottle={16}>
          {posts.map((post) => (
              <ResearchPost
                  key={post.id}
                  postId={post.id}
                  name={post.author || "Unknown Author"}
                  likes={post.likes || 0}
                  comments={post.commentsCount || 0}
                  imageSource={post.imageUrl || ""}
                  title={post.title || "No Title"}
                  content={post.content || "No Content"}
                  userId={userId} // Pass userId to ResearchPost
                  userPFP={post.userPFP}
              />
          ))}
        </Animated.ScrollView>

        <AnimatedFAB
            visible={!loading}
            style={styles.fab}
            icon={"pencil"}
            label={"Make a Post  "}
            color={"white"}
            extended={isExtended} // Use the state to control extension
            onPress={() => router.navigate("./createpost")}
            animateFrom={"right"}
            iconMode={"static"}
        />
      </View>
  );
};

export default Research;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 200,
    height: 70,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: "#00D6B5",
    flex: 0,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 10,
    bottom: 20,
    backgroundColor: "#00D6B5",
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
  },
});
