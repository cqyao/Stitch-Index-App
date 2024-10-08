import { View, Text, Image, SafeAreaView, StyleSheet, ScrollView, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router"; 
import { collection, query, where, getDocs } from 'firebase/firestore';  
import { db } from '../firebaseConfig';  
import EntityComponent from '@/components/entitycomponent';
import Input from '../components/SearchInput';  

// Define a Patient interface for the results
interface Patient {
  id: string;
  'First Name': string;
  'Last Name': string;
  tags: string[];
}

const search = () => {
  const router = useRouter();
  const { query: urlQuery } = useLocalSearchParams();  
  
  const [searchInput, setSearchInput] = useState<string>('');  
  const [tagSearchInput, setTagSearchInput] = useState<string>('');  
  const [patientResults, setPatientResults] = useState<Patient[]>([]);  
  const [tagResults, setTagResults] = useState<Patient[]>([]);  
  const [lastSearchType, setLastSearchType] = useState<'name' | 'tag' | null>(null);  // Track last search type

  useEffect(() => {
    if (typeof urlQuery === 'string') {
      setSearchInput(urlQuery); 
    }
  }, [urlQuery]);

  // Function to search Firestore for patients by first name and last name
  const searchPatientsByName = async () => {
    if (!searchInput.trim()) return; 

    try {
      const patientsCollection = collection(db, 'Patients');

      // Query for First Name and Last Name
      const firstNameQuery = query(patientsCollection, where('First Name', '>=', searchInput), where('First Name', '<=', searchInput + '\uf8ff'));
      const lastNameQuery = query(patientsCollection, where('Last Name', '>=', searchInput), where('Last Name', '<=', searchInput + '\uf8ff'));

      const [firstNameSnapshot, lastNameSnapshot] = await Promise.all([
        getDocs(firstNameQuery),
        getDocs(lastNameQuery),
      ]);

      const results: Patient[] = [];
      const seen = new Set<string>();  // Track unique IDs
      const addResults = (snapshot: any) => {
        snapshot.forEach((doc: any) => {
          if (!seen.has(doc.id)) {
            seen.add(doc.id);
            results.push({ id: doc.id, ...doc.data() });
          }
        });
      };

      addResults(firstNameSnapshot);
      addResults(lastNameSnapshot);

      setPatientResults(results);  // Update the state with fetched results
      setLastSearchType('name');  // Set last search type to 'name'
    } catch (error) {
      console.error('Error searching patients by name:', error);
    }
  };

  // Automatically search when the page loads if there’s a query in the URL
  useEffect(() => {
    if (typeof searchInput === 'string' && searchInput) {
      searchPatientsByName();
    }
  }, [searchInput]);

  // Trigger regular search when `searchInput` changes
  useEffect(() => {
    if (searchInput) {
      searchPatientsByName();
    } else {
      setPatientResults([]);  // Clear results if input is empty
    }
  }, [searchInput]);

  // Function to search Firestore for patients by tags
  const searchPatientsByTag = async () => {
    if (!tagSearchInput.trim()) return;
  
    try {
      const patientsCollection = collection(db, 'Patients');
  
      // Convert search input to lowercase
      const lowerCaseTagSearchInput = tagSearchInput.toLowerCase();
  
      // Query for tags, making sure both input and stored tags are compared in lowercase
      const tagsQuery = query(
        patientsCollection,
        where('tags', 'array-contains', lowerCaseTagSearchInput)
      );
  
      const tagSnapshot = await getDocs(tagsQuery);
  
      const results: Patient[] = []; // Explicitly type the results array
      tagSnapshot.forEach((doc: any) => {
        results.push({ id: doc.id, ...doc.data() });
      });
  
      setTagResults(results); // Update the state with tag search results
      setLastSearchType('tag');  // Set last search type to 'tag'
    } catch (error) {
      console.error('Error searching patients by tags:', error);
    }
  };

  // Trigger tag search when `tagSearchInput` changes
  useEffect(() => {
    if (tagSearchInput) {
      searchPatientsByTag();
    } else {
      setTagResults([]);  // Clear tag results if input is empty
    }
  }, [tagSearchInput]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.banner}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={35} color="black" />
        </Pressable>
        <Image 
          source={require('../assets/images/profilePics/dwayneJo.jpg')}
          style={{ height: 45, width: 45, borderRadius: 90 }}
        />
      </View>

      {/* Search Input for Regular Search */}
      <View style={styles.searchInput}>
        <Input
          defaultValue={searchInput}  // Prepopulate the search input with the query
          onSearch={(value: React.SetStateAction<string>) => setSearchInput(value)}  // Update searchInput when a new search is performed
        />
      </View>

      {/* OR separator */}
      <View style={styles.lineStyle}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      {/* Tags Search Input */}
      <View style={styles.searchInput}>
        <Input
          defaultValue={tagSearchInput}  // Prepopulate the search input with the tag search query
          onSearch={(value: React.SetStateAction<string>) => setTagSearchInput(value)}  // Update tagSearchInput when a new search is performed
        />
      </View>

      {/* Patients Search Results */}
      <View>
        <View style={styles.headerRow}>
          <Text style={styles.titles}> Patients</Text>
          <Pressable onPress={() => router.push({
            pathname: '/seeall',
            params: { query: lastSearchType === 'name' ? searchInput : tagSearchInput, category: 'Patients', searchType: lastSearchType }
          })}>
            <Text style={styles.seeall}> See All</Text>
          </Pressable>
        </View>

        <ScrollView>
          {/* Conditionally render based on last search type */}
          {lastSearchType === 'name' && patientResults.length > 0 ? (
            patientResults.map((patient) => (
              <Pressable key={patient.id} onPress={() => router.push(`/patient?patientId=${patient.id}`)}>
                <EntityComponent imageSource={require("../assets/images/profilePics/dwayneJo.jpg")} title={`${patient['First Name']} ${patient['Last Name']}`} />
              </Pressable>
            ))
          ) : lastSearchType === 'tag' && tagResults.length > 0 ? (
            tagResults.map((patient) => (
              <Pressable key={patient.id} onPress={() => router.push(`/patient?patientId=${patient.id}`)}>
                <EntityComponent imageSource={require("../assets/images/profilePics/dwayneJo.jpg")} title={`${patient['First Name']} ${patient['Last Name']}`} />
              </Pressable>
            ))
          ) : (
            <Text>No patients found</Text>
          )}
        </ScrollView>
      </View>

      {/* Static Records Section */}
      <View>
        <View style={styles.headerRow}>
          <Text style={styles.titles}> Records</Text>
          <Pressable onPress={() => ({})}>
            <Text style={styles.seeall}> See All</Text>
          </Pressable>
        </View>
        <View style={styles.section}>
          <Pressable onPress={() => ({})}>
            <EntityComponent imageSource={require("../assets/images/medical-records.png")} title="Dr. John Le Records"/>
          </Pressable>
          <Pressable onPress={() => ({})}>
            <EntityComponent imageSource={require("../assets/images/medical-records.png")} title="Aneta Guzowska Records"/>
          </Pressable>
          <Pressable onPress={() => ({})}>
            <EntityComponent imageSource={require("../assets/images/medical-records.png")} title="Drake Graham Records"/>
          </Pressable>
        </View>
      </View>

      {/* Static Courses Section */}
      <View>
        <View style={styles.headerRow}>
          <Text style={styles.titles}> Courses</Text>
          <Pressable onPress={() => ({})}>
            <Text style={styles.seeall}> See All</Text>
          </Pressable>
        </View>
        <View style={styles.section}>
          <Pressable onPress={() => ({})}>
            <EntityComponent imageSource={require("../assets/images/courses.png")} title="Anatomy Foundations"/>
          </Pressable>
          <Pressable onPress={() => ({})}>
            <EntityComponent imageSource={require("../assets/images/courses.png")} title="Optometry For Beginners"/>
          </Pressable>
          <Pressable onPress={() => ({})}>
            <EntityComponent imageSource={require("../assets/images/courses.png")} title="Identifying Cancer"/>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default search;

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
  },
  searchInput: {
    marginTop: 5,
    marginHorizontal: 30,
  },
  inputField: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "black",
  },
  lineStyle: {
    flexDirection: "row",
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    alignItems: "center",
  },
  orText: {
    textAlign: "center",
    paddingHorizontal: 10,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titles: {
    paddingTop: 30,
    paddingHorizontal: 25,
    color: "#666666",
    fontFamily: "Inter",
    fontWeight: "bold",
  },
  seeall: {
    paddingTop: 30,
    paddingHorizontal: 25,
    color: "#00D6B5",
    fontFamily: "Inter",
    fontWeight: "700",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 5,
  }
});
