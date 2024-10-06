// CourseComponent.tsx

import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { StarRatingDisplay } from 'react-native-star-rating-widget';

interface CourseProps {
  tag: string;
  time: string;
  rating: number;
  title: string;
  blurb: string;
  userId: string | null;
  userPFP: string;
  name: string;
  price: number;
  buttonLabel: string;
  onPress: () => void;
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
                                                  onPress,
                                                }) => {
  return (
      // Main Course View
      <View style={styles.course}>
        {/* Top Horizontal View */}
        <View style={styles.header}>
          {/* Tag View */}
          <View style={styles.tag}>
            <Text style={styles.tagText} adjustsFontSizeToFit={true} numberOfLines={1}>
              {tag}
            </Text>
          </View>
          {/* Time View */}
          <View style={styles.time}>
            <FontAwesome name="clock-o" size={16} color="#7D7D7D" style={[styles.icon]} />
            <Text style={styles.timeText}>{time} minutes</Text>
          </View>
          {/* Star View */}
          <View style={styles.star}>
            <StarRatingDisplay rating={rating} starSize={20} starStyle={styles.starMod} />
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
          {/* Course Creator's Image */}
          {userPFP ? (
              <Image
                  source={{ uri: userPFP }}
                  style={{
                    height: 35,
                    width: 35,
                    borderRadius: 90,
                    marginRight: 10,
                    borderWidth: 2,
                    borderColor: '#00D6B5',
                  }}
              />
          ) : (
              <FontAwesome name="user-circle-o" size={35} color="#00D6B5" style={{ marginRight: 10 }} />
          )}
          {/* Course Creator's Name */}
          <Text style={styles.nameText}>{name}</Text>
        </View>
        <View style={styles.button}>
          <Pressable onPress={onPress}>
            <Text style={styles.buttonText} adjustsFontSizeToFit={true} numberOfLines={1}>
              {buttonLabel}
            </Text>
          </Pressable>
        </View>
      </View>
  );
};

export default CourseComponent;

const styles = StyleSheet.create({
  course: {
    marginTop: 20,
    height: 150,
    width: 340,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#00D6B5',
    alignSelf: 'center',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tag: {
    width: 75,
    height: 30,
    backgroundColor: '#FF6231',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },
  time: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  timeText: {
    color: '#7D7D7D',
    fontFamily: 'Lato',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  icon: {},
  star: {
    marginLeft: 'auto',
  },
  starMod: {
    gap: -20,
  },
  courseTitle: {
    marginTop: 10,
    fontSize: 20,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    color: '#666666',
  },
  courseBlurb: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#7D7D7D',
  },
  userImage: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontFamily: 'Lato',
    fontWeight: 'bold',
    color: '#7D7D7D',
  },
  button: {
    width: 80,
    height: 30,
    backgroundColor: '#FF6231',
    borderRadius: 8,
    position: 'absolute',
    right: 10,
    bottom: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 15,
  },
});
