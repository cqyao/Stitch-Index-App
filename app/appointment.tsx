import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router';

// import list from database in live version.
const symptomsList = ["Sore throat", "Heachache", "Fever", "Cold sweats"]



const Appointment = () => {
  const params = useLocalSearchParams<{ appTime: string, patName:string }>();
  useEffect(() => {
    console.log(params)
  })
  return (
    <View style={styles.screen}>
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
      <View style={styles.card}>
        <View style={styles.time}>
          <FontAwesome5 name="clock" size={20} color="grey"/>
          <Text style={styles.timeText}>{params.appTime}</Text>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.profileView}>
          <Image 
            source={require('../assets/images/profilePics/johnLe.jpeg')} 
            style={styles.profilePic}
          />
          <View >
            <Text style={styles.profileName}>{params.patName}</Text>
            <Text style={styles.profileType}>Regular Checkup</Text>
          </View>
        </View>
        <View>
          <Text style={styles.h1}>Symptoms</Text>
          {symptomsList.map((symptom) => {
            return (
              <Text key={symptom} style={styles.h2}>{symptom}</Text>
            )
          })}
        </View>
        <View style={{marginVertical: 10}} />
        <View>
          <Text style={styles.h1}>Meeting Type</Text>
          <Text style={styles.h2}>Online</Text>
        </View>
        <View style={styles.lineStyle} />
      </View>
    </View>
  )
}

export default Appointment;

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: "#00D6B5"
  },
  logo: {
    width: 200,
    height: 70,
  },
  screen: {
    backgroundColor: "#F2F2F2",
    //paddingHorizontal: 30,
  },
  card: {
    backgroundColor: "white",
    alignSelf: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    height: 500,
    width: "85%",
    shadowColor: "grey",
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 0.25,
    elevation: 5,
  },
  time: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 15,
    marginLeft: 10,
    color: "grey",
  }, 
  lineStyle: {
    borderBottomColor: '#00D6B5',
    borderBottomWidth: 1,
    width: "95%",
    alignSelf: "center",
    marginVertical: 15,
  },
  h2: {
    marginTop: 5,
    fontSize: 15,
  },
  h1: {
    fontSize: 20,
    fontWeight: "bold",
  }, 
  profilePic: {
    borderRadius: 90,
    height: 70,
    width: 70,
    borderColor: "#00D6B5",
    borderWidth: 1,
  }, 
  profileView: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 20,
  }, 
  profileType: {
    fontSize: 18,
    fontWeight: "300",
    marginLeft: 20,
    color: "grey",
  }
});