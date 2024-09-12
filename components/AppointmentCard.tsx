import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';


interface AppointmentProps {
  time: string,
  name: string
}



const AppointmentCard: React.FC<AppointmentProps> = ({ time, name }) => {
  function navigate() {
    router.push({
      pathname: "../appointment",
      params: { appTime: time, patName: name}
    })
  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection: "row"}}>
        <MaterialIcons style={{padding: 1}} name="access-time" size={15} color="#7D7D7D" />
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <View style={{marginTop: 4, borderBottomColor: 'orange', borderBottomWidth: 2,}}/>
      <View style={{flexDirection: "row"}}>
        <MaterialIcons style={{marginTop: 10,}}name="face" size={60} color="black" />
        <Text style={[styles.timeText, {marginTop: 20, marginLeft: 10,}]}>{name}</Text>
        <TouchableOpacity style={{marginTop: 20, marginLeft: 130,}} onPress={navigate}>
          <MaterialIcons name="arrow-forward-ios" size={40} color="#808080" />
        </TouchableOpacity>
      </View>
      <Text style={[styles.timeText, {marginTop: -30, marginLeft: 70, color: '#808080', fontWeight: 'normal'}]}>Appointment Type</Text>
      <View style={{marginTop: 20, borderBottomColor: 'orange', borderBottomWidth: 2,}}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 15,
    borderWidth: 1.2,
    borderColor: "#02D6B6",
    paddingBottom: 20,
    marginVertical: 15,
  },
  timeText: {
    color: '#7D7D7D',
    fontSize: 14,
    fontWeight: 'bold',
  },

})

export default AppointmentCard