import { View, Text, SafeAreaView, Image, Pressable, StyleSheet, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import PatientInfo from '@/components/PatientInfo';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { PatientProps } from '@/components/PatientInfo'; 
import { useLocalSearchParams } from 'expo-router';  

const Patient = () => {
  const [patientData, setPatientData] = useState<PatientProps | null>(null);
  const { patientId } = useLocalSearchParams();  
  const router = useRouter(); // For navigation and back button

  const fetchPatientData = async (id: string) => {
    try {
      const docRef = doc(db, 'Patients', id);  // Dynamic Patient id
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const formattedData: PatientProps = {
          picture: require('../assets/images/profilePics/johnLe.jpeg'), 
          name: `${data['First Name']} ${data['Last Name']}`, 
          gender: data.Gender,
          birthdateString: data.birthdateString, 
          mobile: data['Mobile'], 
          email: data.Email, 
          symptoms: data.Symptoms, 
          tags: data.tags, 
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
      fetchPatientData(patientId as string);  // fetching data based on patient id
    }
  }, [patientId]);

  if (!patientData) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View>
          <Text>Loading patient data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Banner */}
      <View style={styles.banner}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={35} color="white" />
        </Pressable>
        
        {/* Centering the logo with flex */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/LogoWhite.png')}
            resizeMode='contain'
            style={styles.logo}
          />
        </View>
      </View>
      {/* End of Banner */}
      
      <View>
        <PatientInfo
          picture={patientData.picture}
          name={patientData.name}
          gender={patientData.gender}
          birthdateString={patientData.birthdateString}
          mobile={patientData.mobile}
          email={patientData.email}
          symptoms={patientData.symptoms}
          tags={patientData.tags}
        />
      </View>
    </SafeAreaView>
  );
};

export default Patient;

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: '#00D6B5',
    flex: 0,
  },
  logoContainer: {
    flex: 1,  
    alignItems: 'center',  
  },
  logo: {
    width: 150,  
    height: 50,
  },
});
