import { View, Text, StyleSheet, Image, Pressable, ImageRequireSource } from 'react-native'
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react'

interface ResearchPostProps {
  name: string;
  likes: number;
  comments: number;
  imageSource: string | ImageRequireSource; // Use string for URI or ImageRequireSource for local images
}

const ResearchPost: React.FC<ResearchPostProps> = ({ name, likes, comments, imageSource }) => {
  function RenderImage() {
    return (
      <View>
        {imageSource != "" ? (
          <Image 
          source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource}
          style={{height: 200, width: '100%', marginTop: 10, borderRadius: 5}}
          />
        ) : (
          <View />
        )
        }
      </View>
    )
  }
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row' }}>
          <Image 
            source={require('../assets/images/profilePics/dwayneJo.jpg')}
            style={{height: 35, width: 35, borderRadius: 90, marginRight: 10 }}
          />
          <Text style={styles.h3}>{name}</Text>
        </View>
        <Entypo name="dots-three-vertical" size={20} color="#7D7D7D" />
      </View>
      {/* Body */}
      <View>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
          reprehender
        </Text>
        <RenderImage />
      </View>
      {/* Interactions */}
      <View style={styles.interactions}>
        <View style={styles.interactionSect}>
          <Entypo name="heart" size={30} color="red" />
          <Text style={{ fontSize: 15, marginLeft: 5, color: "#7D7D7D" }}>{likes}</Text>
        </View>
        <View style={styles.interactionSect}>
          <MaterialIcons name="comment" size={30} color="grey" />
          <Text style={{ fontSize: 15, marginLeft: 5, color: "#7D7D7D" }}>{comments}</Text>
        </View>
        <View style={styles.bookmark}>
        <Pressable>
          <Ionicons name="bookmark" size={30} color="green" />
        </Pressable>
      </View>
      </View>
      
    </View>
  )
}

export default ResearchPost

const styles = StyleSheet.create({
  container: {
    margin: 30,
    backgroundColor: "white",
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
    fontWeight: "600",
    color: "#7D7D7D",
  },
  interactions: {
    marginTop: 20, 
    flexDirection: 'row',
    alignItems: "center",
  }, 
  interactionSect: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bookmark: {
    flexDirection: "row-reverse",
    flex: 3,
  }
})