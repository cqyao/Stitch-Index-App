import { View, Text, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router"; 
import { collection, query, where, getDocs } from 'firebase/firestore';  
import { getDownloadURL, ref } from "firebase/storage";  // Import Firebase Storage
import { db, storage } from '../firebaseConfig';  // Ensure storage is imported from firebaseConfig
import EntityComponent from '@/components/entitycomponent';
import Input from '../components/SearchInput';  

// Define a Patient interface for the results
interface Patient {
  id: string;
  fname: string;
  lname: string;
  tag: string[];
  pictureUrl?: string | null;  // Optional URL for the picture
}

const search = () => {
  const router = useRouter();
  const { query: urlQuery } = useLocalSearchParams();  
  
  const [searchInput, setSearchInput] = useState<string>('');  
  const [tagSearchInput, setTagSearchInput] = useState<string>('');  
  const [patientResults, setPatientResults] = useState<Patient[]>([]);  
  const [tagResults, setTagResults] = useState<Patient[]>([]);  
  const [lastSearchType, setLastSearchType] = useState<'name' | 'tag' | null>(null);  // Track last search type

  // Pre-populate the search input from the URL query when the page loads
  useEffect(() => {
    if (typeof urlQuery === 'string') {
      setSearchInput(urlQuery);  // Set the search input so it shows in the search bar
    }
  }, [urlQuery]);

  // Helper function to fetch the image URL from Firebase Storage
  const getImageUrl = async (patientId: string): Promise<string | undefined> => {
    try {
      const imageRef = ref(storage, `patientpfp/${patientId}.png`);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error(`Error fetching image for ${patientId}:`, error);
      return undefined;  // Return undefined if the image doesn't exist
    }
  };
  
  // Function to search Firestore for patients by first name and last name
  const searchPatientsByName = async () => {
    if (!searchInput.trim()) return; 

    try {
      const patientsCollection = collection(db, 'Patients');
      const firstNameQuery = query(patientsCollection, where('fname', '>=', searchInput), where('fname', '<=', searchInput + '\uf8ff'));
      const lastNameQuery = query(patientsCollection, where('lname', '>=', searchInput), where('lname', '<=', searchInput + '\uf8ff'));

      const [firstNameSnapshot, lastNameSnapshot] = await Promise.all([
        getDocs(firstNameQuery),
        getDocs(lastNameQuery),
      ]);

      const results: Patient[] = [];
      const seen = new Set<string>();  // Track unique IDs
      const addResults = async (snapshot: any) => {
        for (const doc of snapshot.docs) {
          if (!seen.has(doc.id)) {
            seen.add(doc.id);
            const data = doc.data();
            const pictureUrl = await getImageUrl(doc.id);  // Fetch image URL or undefined
            results.push({ id: doc.id, ...data, pictureUrl });  // Add the result with pictureUrl
          }
        }
      };
      

      await addResults(firstNameSnapshot);
      await addResults(lastNameSnapshot);

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
      searchPatientsByName();    // Trigger search
    } else {
      setPatientResults([]);     // Clear results if input is empty
    }
  }, [searchInput]);

  // Function to search Firestore for patients by tag
  const searchPatientsByTag = async () => {
    if (!tagSearchInput.trim()) return;
  
    try {
      const patientsCollection = collection(db, 'Patients');
      const lowerCaseTagSearchInput = tagSearchInput.toLowerCase();
      const tagsQuery = query(
        patientsCollection,
        where('tag', 'array-contains', lowerCaseTagSearchInput)
      );
      const tagSnapshot = await getDocs(tagsQuery);
      const results: Patient[] = [];
  
      for (const doc of tagSnapshot.docs) {
        const data = doc.data();
  
        // Make sure data has the required fields before adding to the results array
        if (data.fname && data.lname && data.tag) {
          const pictureUrl = await getImageUrl(doc.id);  // Fetch image URL
          results.push({ id: doc.id, fname: data.fname, lname: data.lname, tag: data.tag, pictureUrl });
        } else {
          console.warn(`Document ${doc.id} is missing required fields (fname, lname, or tag).`);
        }
      }
      
      setTagResults(results);
      setLastSearchType('tag');
    } catch (error) {
      console.error('Error searching patients by tags:', error);
    }
  };

  useEffect(() => {
    if (tagSearchInput) {
      searchPatientsByTag();
    } else {
      setTagResults([]);  
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

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.section}>
            {lastSearchType === 'name' && patientResults.length > 0 ? (
              patientResults.map((patient) => (
                <Pressable key={patient.id} onPress={() => router.push(`/patient?patientid=${patient.id}`)}>
                  <EntityComponent
                    imageSource={patient.pictureUrl ? { uri: patient.pictureUrl } : require("../assets/images/profilePics/dwayneJo.jpg")}  // Use pictureUrl if available
                    title={`${patient.fname} ${patient.lname}`}
                  />
                </Pressable>
              ))
            ) : lastSearchType === 'tag' && tagResults.length > 0 ? (
              tagResults.map((patient) => (
                <Pressable key={patient.id} onPress={() => router.push(`/patient?patientid=${patient.id}`)}>
                  <EntityComponent
                    imageSource={patient.pictureUrl ? { uri: patient.pictureUrl } : require("../assets/images/profilePics/dwayneJo.jpg")}  // Use pictureUrl if available
                    title={`${patient.fname} ${patient.lname}`}
                  />
                </Pressable>
              ))
            ) : (
              <Text>No patients found</Text>
            )}
          </View>
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
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,  
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 5,
  }
});
