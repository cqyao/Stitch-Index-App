import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
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
      <View style={{flexDirection: "row"}}>
        <Text style={[styles.timeText, {marginTop: 20, marginLeft: 10,}]}>{name}</Text>
        <TouchableOpacity style={{marginTop: 20, marginLeft: 200,}} onPress={navigate}>
          <MaterialIcons name="arrow-forward-ios" size={30} color="#808080" />
        </TouchableOpacity>
      </View>
      <Text style={[styles.timeText, {marginLeft: 10, color: '#808080', fontWeight: 'normal'}]}>Appointment Type</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 30,
    //borderWidth: 1.2,
    borderColor: "#02D6B6",
    paddingBottom: 20,
    marginVertical: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowRadius: 8,
    shadowOpacity: 0.2
  },
  timeText: {
    color: '#7D7D7D',
    fontSize: 14,
    fontWeight: 'bold',
  },

})

export default AppointmentCard