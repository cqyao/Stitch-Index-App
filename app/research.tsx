import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import ResearchPost from '../components/ResearchPost';
import CreatePost from '../components/CreatePost';

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
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <CreatePost />
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
        </SafeAreaView>
    );
};

export default Research;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
    },
});
