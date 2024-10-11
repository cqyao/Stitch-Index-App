import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { PatientProps } from '@/components/PatientInfo';
import { ActivityIndicator } from 'react-native-paper';

interface AppointmentProps {
  patientId: string;
  status: boolean;
  time: string;
  type: string;
}

const AppointmentCard: React.FC<AppointmentProps> = ({ patientId, status, time, type }) => {
  const [patientData, setPatientData] = useState<PatientProps | null>(null);

  // Function to get patient info based on patient ID
  const fetchPatientData = async (id: string) => {
    try {
      const docRef = doc(db, 'Patients', id);  // Dynamic Patient ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const formattedData: PatientProps = {
          picture: require('../assets/images/profilePics/johnLe.jpeg'), // Replace with real image if available
          name: `${data['First Name']} ${data['Last Name']}`,
          gender: data.Gender,
          birthdateString: data.birthdateString,
          mobile: data['Mobile'],
          email: data.Email,
          symptoms: data.Symptoms,
          tags: data.tags,
        };
        setPatientData(formattedData);  // Set the patient data
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching patient data: ', error);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatientData(patientId);  // Fetch data based on patient ID
    }
  }, [patientId]);

  // Check if patient data has been fetched and render loading state if null
  if (!patientData) {
    return (
      <SafeAreaView style={ styles.container }>
        <ActivityIndicator 
          animating={true}
          size='large'  
        />
      </SafeAreaView>
    );
  }

  const navigate = () => {
    const serializedData = JSON.stringify(patientData);

    router.push({
      pathname: "../appointment",
      params: { 
        patientId: patientId,
        time: time, 
        type: type,
        data: serializedData
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <MaterialIcons style={{ padding: 1 }} name="access-time" size={15} color="#7D7D7D" />
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={[styles.timeText, { marginTop: 20, marginLeft: 10 }]}>{patientData.name}</Text>
        <Text>{status}</Text>
        <TouchableOpacity style={{ marginTop: 20, marginLeft: "auto" }} onPress={navigate}>
          <MaterialIcons name="arrow-forward-ios" size={30} color="#808080" />
        </TouchableOpacity>
      </View>
      <Text style={[styles.timeText, { marginLeft: 10, color: '#808080', fontWeight: 'normal' }]}>{type}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 30,
    borderColor: "#02D6B6",
    borderWidth: 2,
    paddingBottom: 20,
    marginVertical: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
  },
  timeText: {
    color: '#7D7D7D',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AppointmentCard;
