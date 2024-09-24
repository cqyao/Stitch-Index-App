import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import PatientInfo from '@/components/PatientInfo'

const patient = () => {
  return (
    <SafeAreaView style={{flex: 1,backgroundColor: '#02D6B6'}}>
        <View>
            <PatientInfo picture={require('../assets/images/profilePics/johnLe.jpeg')} name="Dr. John Le" gender="Male" birthdateString="24/09/1980" mobile={482947292} email="jle@uowmail.edu.au" symptoms={["runny nose", "sore throat", "chest cough"]} tags={["flu"]}/>
        </View>
    </SafeAreaView>
  )
}

export default patient

