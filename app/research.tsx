import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView, Image, Pressable, Text } from 'react-native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import ResearchPost from '../components/ResearchPost';
import { Ionicons } from '@expo/vector-icons';
import CreatePost from './createpost';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FAB } from 'react-native-paper';

const Research = () => {
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const postsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(postsData);
        });

        // Clean up the listener on unmount
        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
          {/* Banner */}
            <View style={styles.banner}>
              <Pressable onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={35} color="white" />
              </Pressable>
              <Image
                source={require('../assets/images/LogoWhite.png')} 
                resizeMode='contain'
                style={styles.logo}
              />
              <Image 
                source={require('../assets/images/profilePics/dwayneJo.jpg')}
                style={{height: 45, width: 45, borderRadius: 90}}
              />
            </View>
          {/* End banner */}
          <ScrollView>
            {posts.map((post) => (
              <ResearchPost
                  key={post.id}
                  postId={post.id}
                  name={post.author || 'Unknown Author'}
                  likes={0} // We'll handle likes later
                  comments={0} // We'll handle comments count later
                  imageSource={post.imageUrl || ''}
                  title={post.title || 'No Title'}
                  content={post.content || 'No Content'}
              />
            ))}
          </ScrollView>
          <FAB
            style={styles.fab}
            icon="pencil"
            onPress={()=> router.navigate("./createpost")}
          />
        </View>
    );
};

export default Research;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "red"
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
  postSection: {
    flex: 9,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 10,
    bottom: 20,
    backgroundColor: "#00D6B5"
  },
});
