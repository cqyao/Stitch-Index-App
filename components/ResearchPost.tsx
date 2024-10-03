import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  increment,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface ResearchPostProps {
  postId: string;
  name: string;
  likes: number;
  comments: number;
  imageSource: string;
  title: string;
  content: string;
  userId: string | null;
  userPFP: string;
}

const ResearchPost: React.FC<ResearchPostProps> = ({
                                                     postId,
                                                     name,
                                                     likes,
                                                     comments,
                                                     imageSource,
                                                     title,
                                                     content,
                                                     userId,
                                                     userPFP,
                                                   }) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(likes);

  // Listen for changes in liked status and likes count
  useEffect(() => {
    if (!postId || !userId) return;

    // Listener for liked status
    const likeRef = doc(db, 'posts', postId, 'likes', userId);
    const unsubscribeLike = onSnapshot(likeRef, (likeSnap) => {
      setLiked(likeSnap.exists());
    });

    // Listener for likes count
    const postRef = doc(db, 'posts', postId);
    const unsubscribePost = onSnapshot(postRef, (postSnap) => {
      if (postSnap.exists()) {
        const postData = postSnap.data();
        setLikesCount(postData.likes || 0);
      }
    });

    return () => {
      unsubscribeLike();
      unsubscribePost();
    };
  }, [postId, userId]);

  const handleLike = async () => {
    if (!userId || !postId) return;

    try {
      const likeRef = doc(db, 'posts', postId, 'likes', userId);

      if (liked) {
        // Unlike the post
        await deleteDoc(likeRef);
        await updateDoc(doc(db, 'posts', postId), {
          likes: increment(-1),
        });
      } else {
        // Like the post
        await setDoc(likeRef, {
          userId: userId,
        });
        await updateDoc(doc(db, 'posts', postId), {
          likes: increment(1),
        });
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  function expandPost() {
    if (!postId) {
      console.error('postId is undefined in ResearchPost');
      return;
    }
    router.push({
      pathname: './post',
      params: { postId: postId },
    });
  }

  return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
                source={{ uri: userPFP }}
                style={{ height: 35, width: 35, borderRadius: 90, marginRight: 10 }}
            />
            <Text style={styles.h3}>{name}</Text>
          </View>
          <Entypo name="dots-three-vertical" size={20} color="#7D7D7D" />
        </View>
        {/* Body */}
        <Pressable onPress={expandPost}>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text>{content}</Text>
            {imageSource ? (
                <Image
                    source={{ uri: imageSource }}
                    style={{ height: 200, width: '100%', borderRadius: 10, marginTop: 10 }}
                />
            ) : null}
          </View>
        </Pressable>
        {/* Interactions */}
        <View style={styles.interactions}>
          <Pressable onPress={handleLike} style={styles.interactionItem}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color="red" />
            <Text style={styles.interactionText}>{likesCount} Likes</Text>
          </Pressable>
          <View style={styles.interactionItem}>
            <Ionicons name="chatbubble-outline" size={20} color="gray" />
            <Text style={styles.interactionText}>{comments} Comments</Text>
          </View>
        </View>
      </View>
  );
};

export default ResearchPost;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  h3: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7D7D7D',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  interactions: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  interactionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#7D7D7D',
  },
});
