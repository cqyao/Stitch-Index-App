import { View, Text, StyleSheet, Image, Pressable, ImageRequireSource, SafeAreaView } from 'react-native'
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react'
import { getNormalizedStatePath } from 'expo-router/build/LocationProvider';
import TagsInput from '../components/TagsInput'

export interface PatientProps {
  picture: string | ImageRequireSource; // Use string for URI or ImageRequireSource for local images
  name: string;
  gender: string;
  birthdateString: string;
  mobile: string
  email: string;
  symptoms: string[];
  tags: string[];
}

const PatientInfo: React.FC<PatientProps> = ({ picture, name, gender, birthdateString, mobile, email, symptoms, tags }) => {
  function RenderImage() {
    return (
      <View>
        {picture != "" ? (
          <Image 
          source={typeof picture === 'string' ? { uri: picture } : picture}
          />
        ) : (
          <View />
        )
        }
      </View>
    )
  }
  return (
    <SafeAreaView style={{backgroundColor: "#00D6B5"}}>
        <View style={styles.profile}>
            <Image 
                source={require('../assets/images/profilePics/johnLe.jpeg')}
                style={{height: 130, width: 130, borderRadius: 90, marginRight: 10 }}
            />
        </View>
        <View>
            <Text style={styles.nameHeader}>{name.substring(0,10) + "..."}</Text>
        </View>
        <View>
            <Text style={styles.heading}>General Information</Text>
            <Text>Name: {name}</Text>
            <Text>Gender: {gender}</Text>
            <Text>DOB: {birthdateString}</Text>
            <Text style={styles.heading}>Contact Information</Text>
            <Text>Mobile: {mobile}</Text>
            <Text>Email: {email}</Text>
            <Text style={styles.heading}>Symptoms</Text>
            <Text>Symptoms: {symptoms.join(', ')}</Text>
            <Text style={styles.heading}>Tags</Text>
            <TagsInput/>
        </View>
    </SafeAreaView>
  )
}

export default PatientInfo

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30, 
        backgroundColor: "#00D6B5",
    },
    profile: {
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 70,
    },
    nameHeader: {
        paddingTop: 5,
        color: "#ffffff",
        fontFamily: "Lato",
        fontWeight: "900",
        fontSize: 30,
        textAlign: "center",
    },
    heading: {
        paddingTop: 15,
        color: "#ffffff",
        fontFamily: "Lato",
        fontWeight: "900",
        fontSize: 20,
        textAlign: "left",
        paddingLeft: 20,
    }
})