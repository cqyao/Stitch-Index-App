import { View, Text, SafeAreaView, Image, Pressable, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import PatientInfo from '@/components/PatientInfo';
import { doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db, auth } from '../firebaseConfig';
import { PatientProps } from '@/components/PatientInfo';
import { Card } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import Animated, { FadeIn } from "react-native-reanimated"; // Import LottieView
import { LogBox } from "react-native";
LogBox.ignoreLogs(['Asyncstorage: ...']);
LogBox.ignoreAllLogs();

const Patient = () => {
  const [patientsData, setPatientsData] = useState<PatientProps[]>([]);
  const router = useRouter();

  const fetchPatientsData = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.log('No user is currently signed in.');
        return;
      }

      const userDocRef = doc(db, 'Users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const patientIds = userData.patients; // Assuming 'patients' is an array of patient IDs

        const patientsPromises = patientIds.map(async (patientId: number | string) => {
          const patientDocRef = doc(db, 'Patients', patientId.toString());
          const patientDocSnap = await getDoc(patientDocRef);

          if (patientDocSnap.exists()) {
            const data = patientDocSnap.data();

            // Fetch the picture URL from Firebase Storage
            const storage = getStorage();
            const pictureRef = ref(storage, `patientpfp/${patientId}.png`);
            let pictureUrl = '';
            try {
              pictureUrl = await getDownloadURL(pictureRef);
            } catch (error) {
              console.error(`Error fetching picture for patient ${patientId}:`, error);
              // Optionally set a default picture URL
              pictureUrl = ''; // Or set to a default image URL if available
            }

            const formattedData: PatientProps = {
              id: patientId, // Added id here
              picture: pictureUrl,
              name: `${data.fname} ${data.lname}`,
              gender: data.gender,
              birthdateString: data.birthdate,
              pronouns: data.pronouns,
              mobile: data.phone,
              email: data.email,
              symptoms: data.symptoms,
              PatientReport: data.PatientReport,
              tags: data.tag, // Adjusted to match your data structure
            };
            return formattedData;
          } else {
            console.log(`No such patient document with ID ${patientId}!`);
            return null;
          }
        });

        const patients = await Promise.all(patientsPromises);
        const validPatients = patients.filter(p => p !== null) as PatientProps[];
        setPatientsData(validPatients);
      } else {
        console.log('No such user document!');
      }
    } catch (error) {
      console.error('Error fetching patients data: ', error);
    }
  };

  useEffect(() => {
    fetchPatientsData();
  }, []);

  if (patientsData.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.loadingContainer}>
          <LottieView
            source={require('../assets/Animations/loading.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#02D6B6' }}>
      {/* Banner */}
      <View style={styles.banner}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={35} color="white" />
        </Pressable>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/LogoWhite.png')}
            resizeMode='contain'
            style={styles.logo}
          />
        </View>
      </View>
      {/* End of Banner */}
      <View style={{ backgroundColor: "white" }}>
        <Animated.ScrollView>
          {patientsData.map((patientData, index) => (
            <Animated.View
              key={index}
              entering={FadeIn.delay(index * 100)} // Adjust delay based on index
            >
              <Card
                onPress={() => router.push({ pathname: '/PatientDetails', params: { id: patientData.id } })}
                style={styles.card}
                mode={'outlined'}
              >
                <PatientInfo
                  id={patientData.id}
                  picture={patientData.picture}
                  name={patientData.name}
                  gender={patientData.gender}
                  pronouns={patientData.pronouns}
                  birthdateString={patientData.birthdateString}
                  mobile={patientData.mobile}
                  email={patientData.email}
                  symptoms={patientData.symptoms}
                  PatientReport={patientData.PatientReport}
                  tags={patientData.tags}
                />
              </Card>
            </Animated.View>
          ))}
        </Animated.ScrollView>
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
  card: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 55,
    elevation: 3,
    backgroundColor: '#d6e9fd',  // Set your desired background color here

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },
});
