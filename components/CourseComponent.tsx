import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable} from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { fontConfig } from 'react-native-paper/lib/typescript/styles/fonts';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import StarRating from 'react-native-star-rating-widget';
import { StarRatingDisplay } from 'react-native-star-rating-widget';

interface CourseProps {
    tag: string,
    time: string,
    rating: number,
    title: string,
    blurb: string,
    userId: string | null;
    userPFP: string;
    name: string,
    price: number,
    // Button Label will be replaced depending on factors such as whether the user has purchased the course or not e.g. $50 if unpurchased and "Continue" if purchased
    buttonLabel: string,

  }

  const CourseComponent: React.FC<CourseProps> = ({
    tag,
    time,
    rating,
    title,
    blurb,
    userId,
    userPFP,
    name,
    price,
    buttonLabel,
  }) => {

  return (
    // Main Course View
    <View style={styles.course}>
      {/* Top Horizontal View */}
      <View style={styles.header}>
        {/* Tag View */}
        <View style={styles.tag}>
          <Text style={styles.tagText} adjustsFontSizeToFit={true} numberOfLines={1}>{tag}</Text>
        </View>
        {/* Time View */}
        <View style={styles.time}>
          <FontAwesome name="clock-o" size={16} color="#7D7D7D" style={[styles.icon]}/>
          <Text style={styles.timeText}>{time} minutes</Text>
        </View>
        {/* Star View */}
        <View style={styles.star}>
          <StarRatingDisplay rating={rating} starSize={20} starStyle={styles.starMod}/>
        </View>
      </View>
      {/* Course Title */}
      <View>
        <Text style={styles.courseTitle}>{title}</Text>
      </View>
      {/* Course Blurb */}
      <View>
        <Text style={styles.courseBlurb}>{blurb}</Text>
      </View>
      {/* Bottom Row */}
      <View style={styles.userImage}>
        {/* Course Posters Image */}
        <Image
          source={{ uri: userPFP }}
          style={{ height: 35, width: 35, borderRadius: 90, marginRight: 10, borderWidth: 2, borderColor: "#00D6B5"}}
        />
        {/* Course Posters Name */}
        <Text style={styles.nameText}>{name}</Text>
        {/* Button */}
      </View>
      <View style={styles.button}>
          <Pressable>
            <Text style={styles.buttonText} adjustsFontSizeToFit={true} numberOfLines={1}>{buttonLabel}</Text>
          </Pressable>
      </View>
    </View>
  )}


  export default CourseComponent;

  const styles = StyleSheet.create({
    course: {
      marginTop: 20,
      height: 150,
      width: 340,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: "#00D6B5",
      alignSelf: "center",
    },
    header: {
      flexDirection: "row",
      verticalAlign: "middle", 
      gap: 10,
    },
    tag: {
      width: 75,
      height: 30,
      backgroundColor: "#FF6231",
      borderRadius: 8,
      left: 5,
      top: 5,
      alignItems: "center",
      justifyContent: "center",
      
  },
    tagText: {
      color: "white",
      alignSelf: "center",
      textAlign: "center",
      textAlignVertical: "center",
      justifyContent: "center",
      fontSize: 15,
  },
  time : {
    flexDirection: "row",
    gap: 2,
  },
  timeText : {
    top: 9,
    color: "#7D7D7D",
    fontFamily: "Lato",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  icon : {
    top: 5,
    verticalAlign: "middle",
  },
  star : {
    top: 9,
    position: "absolute",
    left: "55%",
  },
  starMod : {
    gap: -20,
  },
  courseTitle : {
    top: 10,
    left: 6,
    right: 6,
    fontSize: 20,
    fontFamily: "Inter",
    fontWeight: "bold",
    color: "#666666",
  },
  courseBlurb : {
    top: 10,
    left: 6,
    right: 6,
    fontSize: 14,
    fontFamily: "Inter",
    color: "#7D7D7D",
  },
  userImage : {
    top: 12,
    left: 6,
    flexDirection: "row",
  },
  nameText : {
    textAlign: "center",
    textAlignVertical: "center",
    left: -5,
    fontFamily: "Lato",
    fontWeight: "bold",
    color: "#7D7D7D",
  },
  button : {
    width: 80,
    height: 30,
    backgroundColor: "#FF6231",
    borderRadius: 8,
    position: "absolute",
    left: "75%",
    top: "75%",
  },
  buttonText : {
    color: "white",
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
    justifyContent: "center",
    padding: 3,
    top: 1,
    fontSize: 15,
  },
  })