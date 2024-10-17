import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, query as firestoreQuery, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import EntityComponent from '@/components/entitycomponent';
import { LogBox } from "react-native";
LogBox.ignoreLogs(['Asyncstorage: ...']);
LogBox.ignoreAllLogs();

// Define a generic type for the results based on possible categories
interface Patient {
    id: string;
    'First Name': string;
    'Last Name': string;
    tags: string[];
  }
  
  interface Record {
    id: string;
    patientName: string;
  }
  
  interface Course {
    id: string;
    courseName: string;
  }
  
  type ResultType = Patient | Record | Course;

const SeeAll = () => {
  const { query: searchTerm, category, searchType } = useLocalSearchParams();
  const [results, setResults] = useState<ResultType[]>([]);  // Explicitly type results as an array of ResultType
  const router = useRouter();

  // Fetch the records based on the category and search term
  const fetchRecords = async () => {
    if (!searchTerm || !category || !searchType) return;
  
    try {
      let recordsCollection;
      let querySnapshot;
  
      if (category === 'Patients') {
        recordsCollection = collection(db, 'Patients');
  
        if (searchType === 'name') {
          // Search by name (First Name and Last Name)
          querySnapshot = await getDocs(firestoreQuery(
            recordsCollection,
            where('First Name', '>=', searchTerm),
            where('First Name', '<=', searchTerm + '\uf8ff')
          ));
        } else if (searchType === 'tag') {
          // Check if searchTerm is a string and convert it to lowercase
          const searchTermLower = typeof searchTerm === 'string' ? searchTerm.toLowerCase() : '';
  
          // Search by tag (if searchTerm is a string)
          if (searchTermLower) {
            querySnapshot = await getDocs(firestoreQuery(
              recordsCollection,
              where('tags', 'array-contains', searchTermLower)
            ));
          }
        }
  
        // Check if querySnapshot is defined and has documents
        if (querySnapshot && !querySnapshot.empty) {
          // Map the documents to the Patient type
          const resultsData: Patient[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Patient));
          setResults(resultsData);  // Update the state with fetched patient results
        } else {
          setResults([]);  // If no documents found, set results to an empty array
        }
  
      } else if (category === 'Records') {
        // Similar logic for Records (if applicable)
        // ...
      } else if (category === 'Courses') {
        // Similar logic for Courses (if applicable)
        // ...
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      setResults([]);  // Set results to empty array on error
    }
  };
  

  // Fetch records when the component mounts or when the search term or category changes
  useEffect(() => {
    fetchRecords();
  }, [searchTerm, category]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>See All {category}</Text>
      <ScrollView>
        {results.length > 0 ? (
          results.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                if (category === 'Patients') {
                    router.push(`/patient?patientId=${item.id}`);
                } else if (category === 'Records') {
                  //router.push(`/records?recordId=${item.id}`);
                } else if (category === 'Courses') {
                    router.push(`/courses?courseId=${item.id}`);
                }
              }}
            >
              <EntityComponent
                imageSource={require('../assets/images/profilePics/johnLe.jpeg')}  
                title={category === 'Patients' && 'First Name' in item
                  ? `${item['First Name']} ${item['Last Name']}` 
                  : category === 'Records' && 'patientName' in item
                  ? item.patientName
                  : 'courseName' in item
                  ? item.courseName
                  : ''
                }  // Adjust title based on category and type
              />
            </Pressable>
          ))
        ) : (
          <Text>No records found</Text>
        )}
      </ScrollView>
    </View>
  );
}
export default SeeAll;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
