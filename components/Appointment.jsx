import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Feather, MaterialIcons, Entypo } from '@expo/vector-icons';

const Appointment = ({ date, timeFrom, timeTo }) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Feather name="clock" size={22} color="grey"/>
        <Text>  {date} - {timeFrom}am : {timeTo}pm</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", }}>
        <View style={styles.profilePic}>
          <MaterialIcons name="face-5" size={30} color="black" />
        </View>
        <Text style={{ marginLeft: 10, marginRight: 40}}>Dr. John E. Sins{"\n"}Regular Check-up</Text>
        <Entypo name="chevron-thin-right" size={30} color="lightgrey" style={{ marginLeft: "auto" }}/>
      </View>    
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: 10,
    borderColor: "#02D6B6",
    borderRadius: 15,
    height: 130,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.2
  },
  profilePic: {
    marginTop: 10,
    borderWidth: 2,
    height: 55,
    width: 55,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#02D6B6",
    borderRadius: 45,
  },
});

export default Appointment