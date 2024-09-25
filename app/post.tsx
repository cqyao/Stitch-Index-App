import { View, Text, Image, Pressable, StyleSheet, TextInput } from 'react-native'
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import Comment from '@/components/Comment';

const post = () => {
  const params = useLocalSearchParams<{ name: string, likes: string, comments: string, imageSource: string }>();
  
  return (
      <View style={{flex: 1,backgroundColor: '#02D6B6'}}>
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
        <View style={styles.postSection}>
          <Text style={styles.title}>Post Title</Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
          </Text>
          {/* Interactions */}
          <View style={styles.interactions}>
            <View style={styles.interactionSect}>
              <Entypo name="heart" size={30} color="red" />
              <Text style={{ fontSize: 15, marginLeft: 5, color: "#7D7D7D" }}>12</Text>
            </View>
            <View style={styles.interactionSect}>
              <MaterialIcons name="comment" size={30} color="grey" />
              <Text style={{ fontSize: 15, marginLeft: 5, color: "#7D7D7D" }}>5</Text>
            </View>
            <View style={styles.bookmark}>
              <Pressable>
                <Ionicons name="bookmark" size={30} color="green" />
              </Pressable>
            </View>
          </View>
          {/* Comment section */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={styles.commentInput}
              placeholder='Add a comment'
            />
            <Pressable style={styles.commentBtn}>
              <Text>Comment</Text>
            </Pressable>
          </View>
          <View>
            <Comment username="Bobby Wasabi" date={3}/>
            <Comment username="Christmas Day" date={10}/>
          </View>
          
        </View>
      </View>
      
  )
}

export default post

const styles = StyleSheet.create({
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
    paddingBottom: 30,
    backgroundColor: "#00D6B5",
    flex: 1
  },
  postSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    flex: 10
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
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 10,
  },
  commentBtn: {
    padding: 10,
    borderRadius: 90,
    backgroundColor: "#00D6B5",
    flex: 2,
    alignContent: 'center',
    alignItems: 'center'
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