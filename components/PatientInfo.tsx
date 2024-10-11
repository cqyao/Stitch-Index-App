import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import React from 'react';
import TagsInputPatient from '../components/TagsInputPatient';

export interface PatientProps {
  picture: { uri: string } | number; 
  name: string;
  gender: string;
  birthdateString: string;
  mobile: string;
  email: string;
  symptoms: string[];
  tags: string[];
}

const PatientInfo: React.FC<PatientProps> = ({ picture, name, gender, birthdateString, mobile, email, symptoms, tags }) => {
  return (
    <SafeAreaView style={{ backgroundColor: "#white" }}>
      <View style={styles.profile}>
        <Image
          source={picture}
          style={{ height: 130, width: 130, borderRadius: 90, marginRight: 10 }}
        />
      </View>
      <View>
        <Text style={styles.nameHeader}>{name.substring(0, 10) + "..."}</Text>
      </View>
      <View>
        <Text style={styles.heading}>General Information</Text>
        <Text style={styles.regText}>Name: {name}</Text>
        <Text style={styles.regText}>Gender: {gender}</Text>
        <Text style={styles.regText}>DOB: {birthdateString}</Text>
        <Text style={styles.heading}>Contact Information</Text>
        <Text style={styles.regText}>Mobile: {mobile}</Text>
        <Text style={styles.regText}>Email: {email}</Text>
        <Text style={styles.heading}>Symptoms</Text>
        <Text style={styles.regText}>{symptoms.join(', ')}</Text>
        <Text style={styles.heading}>Tags</Text>
        <View style={styles.tagInput}>
          <TagsInputPatient />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PatientInfo;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    backgroundColor: "#white",
  },
  profile: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  nameHeader: {
    paddingTop: 5,
    color: "#FF6231",
    fontFamily: "Lato",
    fontWeight: "900",
    fontSize: 30,
    textAlign: "center",
  },
  heading: {
    paddingTop: 15,
    color: "#FF6231",
    fontFamily: "Lato",
    fontWeight: "900",
    fontSize: 20,
    textAlign: "left",
    paddingLeft: 20,
  },
  regText: {
    paddingLeft: 20,
    fontSize: 15,
    color: "#7D7D7D",
    fontWeight: "bold",
    fontFamily: "Lato",
  },
  tagInput: {
    paddingHorizontal: 20,
  },
});
