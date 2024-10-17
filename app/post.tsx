import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Comment from "@/components/Comment";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  increment,
  deleteDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {FadeIn} from "react-native-reanimated";
import { LogBox } from "react-native";
LogBox.ignoreLogs(['Asyncstorage: ...']);
LogBox.ignoreAllLogs();

const Post = () => {
  const params = useLocalSearchParams<{
    postId: string;
  }>();
  const { postId } = params;

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [author, setAuthor] = useState<string | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  const getAuthorFromAsyncStorage = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        setAuthor(`${userData.firstName} ${userData.lastName}`);
        setUserId(userData.uid);
      }
    } catch (error) {
      console.error("Error fetching author data from AsyncStorage", error);
    }
  };

  useEffect(() => {
    getAuthorFromAsyncStorage();
  }, []);

  useEffect(() => {
    if (!postId) return;

    const postRef = doc(db, "posts", postId);
    const unsubscribePost = onSnapshot(
        postRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const postData = docSnap.data();
            setPost({ id: docSnap.id, ...postData });
            setLikes(postData.likes || 0);
          }
        },
        (error) => {
          console.error("Error fetching post:", error);
        }
    );

    const commentsRef = collection(db, "posts", postId, "comments");
    const q = query(commentsRef, orderBy("timestamp", "desc"));
    const unsubscribeComments = onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp || null,
        };
      });
      setComments(commentsData);
    });

    // Cleanup the listeners
    return () => {
      unsubscribePost();
      unsubscribeComments();
    };
  }, [postId]);

  useEffect(() => {
    if (!postId || !userId) return;

    const likeRef = doc(db, "posts", postId, "likes", userId);
    const unsubscribeLike = onSnapshot(likeRef, (likeSnap) => {
      setLiked(likeSnap.exists());
    });

    return () => {
      unsubscribeLike();
    };
  }, [postId, userId]);

  const handleCommentSubmit = async () => {
    if (commentText.trim() === "") return;

    try {
      const commentsRef = collection(db, "posts", postId, "comments");
      await addDoc(commentsRef, {
        author: author,
        content: commentText,
        timestamp: Timestamp.now(),
      });

      // Update comment count in the post document
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        commentsCount: increment(1),
      });

      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLike = async () => {
    if (!userId || !postId) return;

    try {
      const likeRef = doc(db, "posts", postId, "likes", userId);

      if (liked) {
        // Unlike the post
        await deleteDoc(likeRef);
        await updateDoc(doc(db, "posts", postId), {
          likes: increment(-1),
        });
      } else {
        // Like the post
        await setDoc(likeRef, {
          userId: userId,
        });
        await updateDoc(doc(db, "posts", postId), {
          likes: increment(1),
        });
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  if (!post) {
    return <Text>Loading...</Text>;
  }

  return (
      <View style={{ flex: 1, backgroundColor: "#02D6B6" }}>
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
          <Image
              source={require("../assets/images/profilePics/dwayneJo.jpg")}
              style={{ height: 45, width: 45, borderRadius: 90 }}
          />
        </View>
        {/* End banner */}
        {/* Post Section */}
        <ScrollView contentContainerStyle={styles.postSection}>
          <Text style={styles.title}>{post.title}</Text>
          {post.imageUrl ? (
              <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
          ) : null}
          <Text>{post.content}</Text>

          {/* Like Section */}
          <Pressable
              onPress={handleLike}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 10,
              }}
          >
            <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={24}
                color="red"
            />
            <Text style={{ marginLeft: 5 }}>{likes} Likes</Text>
          </Pressable>

          {/* Comment Input */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
                style={styles.commentInput}
                placeholder="Add a comment"
                value={commentText}
                onChangeText={(text) => setCommentText(text)}
            />
            <Pressable style={styles.commentBtn} onPress={handleCommentSubmit}>
              <Text>Post</Text>
            </Pressable>
          </View>

          <Text>{post.commentsCount || 0} Comments</Text>

          {/* Comments Section */}
          <Animated.View entering={FadeIn.delay(300)}>
            {comments.map((comment) => (
                <Comment
                    key={comment.id}
                    username={comment.author}
                    date={comment.timestamp ? comment.timestamp.toDate() : undefined}
                    content={comment.content}
                />
            ))}
          </Animated.View>
        </ScrollView>
      </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  postSection: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
  },
  logo: {
    width: 200,
    height: 70,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginVertical: 15,
  },
  commentInput: {
    padding: 10,
    borderRadius: 90,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "grey",
    marginVertical: 20,
    flex: 1,
    marginRight: 10,
  },
  commentBtn: {
    padding: 10,
    borderRadius: 90,
    backgroundColor: "#00D6B5",
    alignContent: "center",
    alignItems: "center",
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
  },
});
