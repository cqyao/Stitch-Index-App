import { View, Text, Image, Pressable, StyleSheet, TextInput } from 'react-native';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import Comment from '@/components/Comment';
import { collection, addDoc, doc, getDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Post = () => {
  const params = useLocalSearchParams<{
    postId: string;
  }>();
  const { postId } = params;

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          setPost({ id: postSnap.id, ...postSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const fetchComments = () => {
      if (!postId) return;

      const commentsRef = collection(db, 'posts', postId, 'comments');
      const q = query(commentsRef, orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
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

      return unsubscribe;
    };

    fetchPost();
    const unsubscribeComments = fetchComments();

    // Cleanup the listener
    return () => {
      if (unsubscribeComments) unsubscribeComments();
    };
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (commentText.trim() === '') return;

    try {
      const commentsRef = collection(db, 'posts', postId, 'comments');
      await addDoc(commentsRef, {
        author: 'Current User', // Replace with actual user data i will do this stuff later
        content: commentText,
        timestamp: Timestamp.now(),
      });
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!post) {
    return <Text>Loading...</Text>;
  }

  return (
      <View style={{ flex: 1, backgroundColor: '#02D6B6' }}>
        {/* Post Section */}
        <View style={styles.postSection}>
          <Text style={styles.title}>{post.title}</Text>
          {post.imageUrl ? (
              <Image
                  source={{ uri: post.imageUrl }}
                  style={styles.postImage}
              />
          ) : null}
          <Text>{post.content}</Text>

          {/* Comment Section */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
                style={styles.commentInput}
                placeholder="Add a comment"
                value={commentText}
                onChangeText={(text) => setCommentText(text)}
            />
            <Pressable style={styles.commentBtn} onPress={handleCommentSubmit}>
              <Text>Comment</Text>
            </Pressable>
          </View>
          <View>
            {comments.map((comment) => (
                <Comment
                    key={comment.id}
                    username={comment.author}
                    date={comment.timestamp ? comment.timestamp.toDate() : undefined}
                    content={comment.content}
                />
            ))}
          </View>
        </View>
      </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  postSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    flex: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginVertical: 15,
  },
  commentInput: {
    padding: 10,
    borderRadius: 90,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
    marginVertical: 20,
    flex: 8,
    marginRight: 10,
  },
  commentBtn: {
    padding: 10,
    borderRadius: 90,
    backgroundColor: '#00D6B5',
    flex: 2,
    alignContent: 'center',
    alignItems: 'center',
  },
});
