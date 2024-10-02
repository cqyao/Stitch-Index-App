import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import {Entypo} from "@expo/vector-icons";
import {router} from "expo-router";

interface ResearchPostProps {
  postId: string;
  name: string;
  likes: number;
  comments: number;
  imageSource: string;
  title: string;
  content: string;
}

const ResearchPost: React.FC<ResearchPostProps> = ({
                                                     postId,
                                                     name,
                                                     likes,
                                                     comments,
                                                     imageSource,
                                                     title,
                                                     content,
                                                   }) => {
  const [liked, setLiked] = useState(false);

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
      <Pressable onPress={expandPost}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                  source={require('../assets/images/profilePics/dwayneJo.jpg')}
                  style={{ height: 35, width: 35, borderRadius: 90, marginRight: 10 }}
              />
              <Text style={styles.h3}>{name}</Text>
            </View>
            <Entypo name="dots-three-vertical" size={20} color="#7D7D7D" />
          </View>
          {/* Body */}
          <View>
            <Text style={styles.h3}>{title}</Text>
            <Text>{content}</Text>
            {imageSource ? (
                <Image
                    source={{ uri: imageSource }}
                    style={{ height: 200, width: '100%', borderRadius: 10, marginTop: 10 }}
                />
            ) : null}
          </View>

          <View style={styles.interactions}>

          </View>
        </View>
      </Pressable>
  );
};

export default ResearchPost;

const styles = StyleSheet.create({
  container: {
    margin: 30,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  h3: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7D7D7D',
  },
  interactions: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
