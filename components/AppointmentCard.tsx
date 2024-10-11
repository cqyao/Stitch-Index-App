import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { PatientProps } from '@/components/PatientInfo';
import { ActivityIndicator, Button } from 'react-native-paper';

interface AppointmentProps {
  id: string;
  patientId: string;
  status: boolean;
  time: string;
  type: string;
}

const AppointmentCard: React.FC<AppointmentProps> = ({ id, patientId, status, time, type }) => {
  const [patientData, setPatientData] = useState<PatientProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Function to get patient info based on patient ID
  const fetchPatientData = async (id: string) => {
    try {
      const docRef = doc(db, 'Patients', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const formattedData: PatientProps = {
          id: id,
          pronouns: data.pronouns || '',
          picture: require('../assets/images/profilePics/johnLe.jpeg'), // Replace with actual image if available
          name: `${data['fname']} ${data['lname']}`,
          gender: data.gender,
          birthdateString: data.birthdate,
          mobile: data['phone'],
          email: data.email,
          symptoms: data.symptoms,
          tags: data.tag,
        };
        setPatientData(formattedData);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching patient data: ', error);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatientData(patientId);
    }
  }, [patientId]);

  if (!patientData) {
    return (
        <SafeAreaView style={styles.container}>
          <ActivityIndicator animating={true} size="large" />
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
        data: serializedData,
      },
    });
  };

  const markAsCompleted = async () => {
    setLoading(true);
    try {
      const appointmentRef = doc(db, 'Appointments', id);
      await updateDoc(appointmentRef, { status: true });
      Alert.alert('Success', 'Appointment marked as completed.');
      // No need to refresh appointments; the listener will update the list
    } catch (error) {
      console.error('Error updating appointment status:', error);
      Alert.alert('Error', 'Failed to update appointment status.');
    }
    setLoading(false);
  };

  return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <MaterialIcons style={{ padding: 1 }} name="access-time" size={15} color="#7D7D7D" />
          <Text style={styles.timeText}>{time}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.timeText, { marginTop: 20, marginLeft: 10 }]}>{patientData.name}</Text>
          <TouchableOpacity style={{ marginTop: 20, marginLeft: 'auto' }} onPress={navigate}>
            <MaterialIcons name="arrow-forward-ios" size={30} color="#808080" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.timeText, { marginLeft: 10, color: '#808080', fontWeight: 'normal' }]}>{type}</Text>

        {/* Add the "Mark as Completed" button if the appointment is upcoming */}
        {!status && (
            <Button
                mode="contained"
                onPress={markAsCompleted}
                loading={loading}
                style={styles.completeButton}
            >
              Mark as Completed
            </Button>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 30,
    borderColor: '#02D6B6',
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
  completeButton: {
    marginTop: 10,
    backgroundColor: '#02D6B6',
  },
});

export default AppointmentCard;
