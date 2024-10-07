import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import PatientInfo from "@/components/PatientInfo";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { PatientProps } from "@/components/PatientInfo";
import { useLocalSearchParams } from "expo-router";

const Patient = () => {
  const [patientData, setPatientData] = useState<PatientProps | null>(null);
  const { patientId } = useLocalSearchParams();

  const fetchPatientData = async (id: string) => {
    try {
      const docRef = doc(db, "Patients", id); // Dynamic Patient id
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const formattedData: PatientProps = {
          picture: require("../assets/images/profilePics/johnLe.jpeg"),
          name: `${data["First Name"]} ${data["Last Name"]}`,
          gender: data.Gender,
          birthdateString: data.birthdateString,
          mobile: data["Mobile"],
          email: data.Email,
          symptoms: data.Symptoms,
          tags: data.tags,
        };
        setPatientData(formattedData);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching patient data: ", error);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatientData(patientId as string); // fetching data based on patient id
    }
  }, [patientId]);

  if (!patientData) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#02D6B6" }}>
        <View>
          <Text>Loading patient data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#02D6B6" }}>
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
