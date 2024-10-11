import { View, Text, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router"; 
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';  
import { getDownloadURL, ref } from "firebase/storage";  
import { db, storage, auth } from '../firebaseConfig'; // Make sure auth is imported
import EntityComponent from '@/components/entitycomponent';
import Input from '../components/SearchInput';  

// Define a Patient interface for the results
interface Patient {
  id: string;
  fname: string;
  lname: string;
  tag: string[];
  pictureUrl?: string | null;
}

// Define a Course interface for the results
interface Course {
  id: string;
  title: string;
}

// Define an Appointment interface for the results
interface Appointment {
  id: string;
  patientId: string;
  type: string;
  time: string;
  status: boolean;
  patientPFP?: string;
  patientName?: string;
}

interface SectionComponentProps {
  title: string;
  seeAllRoute: { pathname: string, params?: Record<string, any> } | null; 
  results: any[];
  loading: boolean;
  noResultText: string;
  renderItem: (item: any) => React.ReactNode;
}

const search = () => {
  const router = useRouter();
  const { query: urlQuery } = useLocalSearchParams();  
  
  const [searchInput, setSearchInput] = useState<string>('');  
  const [tagSearchInput, setTagSearchInput] = useState<string>('');  
  const [patientResults, setPatientResults] = useState<Patient[]>([]);  
  const [tagResults, setTagResults] = useState<Patient[]>([]);  
  const [courseResults, setCourseResults] = useState<Course[]>([]);  
  const [appointmentResults, setAppointmentResults] = useState<Appointment[]>([]);
  const [lastSearchType, setLastSearchType] = useState<'name' | 'tag' | 'course' | null>(null);  
  const [loading, setLoading] = useState<boolean>(false);  
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Add state for user image

  useEffect(() => {
    if (typeof urlQuery === 'string') {
      setSearchInput(urlQuery);
    }
  }, [urlQuery]);

  // Fetch user profile picture from Firebase Storage using current user's UID
  useEffect(() => {
    const fetchUserProfilePicture = async () => {
      try {
        const user = auth.currentUser; // Get the currently authenticated user
        if (user) {
          const imageRef = ref(storage, `pfp/${user.uid}`); 
          const url = await getDownloadURL(imageRef);
          setImageUrl(url); // Set the fetched URL to the state
        }
      } catch (error) {
        console.error("Error fetching user profile picture: ", error);
        setImageUrl(null); // Fallback to null if there's an error
      }
    };

    fetchUserProfilePicture();
  }, []);

  const getImageUrl = async (patientId: string): Promise<string | undefined> => {
    try {
      const imageRef = ref(storage, `patientpfp/${patientId}.png`);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error(`Error fetching image for ${patientId}:`, error);
      return undefined;
    }
  };

  const searchPatientsByName = async () => {
    if (!searchInput.trim()) return;
    setPatientResults([]);
    setLoading(true);
    try {
      const patientsCollection = collection(db, 'Patients');
      const firstNameQuery = query(patientsCollection, where('fname', '>=', searchInput), where('fname', '<=', searchInput + '\uf8ff'));
      const lastNameQuery = query(patientsCollection, where('lname', '>=', searchInput), where('lname', '<=', searchInput + '\uf8ff'));

      const [firstNameSnapshot, lastNameSnapshot] = await Promise.all([
        getDocs(firstNameQuery),
        getDocs(lastNameQuery),
      ]);

      const results: Patient[] = [];
      const seen = new Set<string>();
      const addResults = async (snapshot: any) => {
        for (const doc of snapshot.docs) {
          if (!seen.has(doc.id)) {
            seen.add(doc.id);
            const data = doc.data();
            const pictureUrl = await getImageUrl(doc.id);
            results.push({ id: doc.id, ...data, pictureUrl });
          }
        }
      };
      
      await addResults(firstNameSnapshot);
      await addResults(lastNameSnapshot);

      setPatientResults(results);
      setLastSearchType('name');
      searchAppointmentsByPatientIds(results.map(patient => patient.id), results);
    } catch (error) {
      console.error('Error searching patients by name:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchAppointmentsByPatientIds = async (patientIds: string[], patientDetails: Patient[]) => {
    setAppointmentResults([]);
    if (patientIds.length === 0) return;
    try {
      const appointmentsCollection = collection(db, 'Appointments');
      const appointmentsQuery = query(appointmentsCollection, where('patientId', 'in', patientIds));
      const appointmentsSnapshot = await getDocs(appointmentsQuery);

      const results: Appointment[] = [];
      appointmentsSnapshot.forEach((doc) => {
        const data = doc.data();
        const patient = patientDetails.find(p => p.id === data.patientId);
        results.push({
          id: doc.id,
          patientId: data.patientId,
          type: data.type,
          time: data.time,
          status: data.status,
          patientPFP: patient?.pictureUrl || undefined,
          patientName: `${patient?.fname} ${patient?.lname}`
        });
      });

      setAppointmentResults(results);
    } catch (error) {
      console.error('Error searching appointments:', error);
    }
  };

  const searchPatientsByTag = async () => {
    if (!tagSearchInput.trim()) return;
    setTagResults([]);
    setLoading(true);
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
        if (data.fname && data.lname && data.tag) {
          const pictureUrl = await getImageUrl(doc.id);
          results.push({ id: doc.id, fname: data.fname, lname: data.lname, tag: data.tag, pictureUrl });
        }
      }
      
      setTagResults(results);
      setLastSearchType('tag');
      searchAppointmentsByPatientIds(results.map(patient => patient.id), results);
    } catch (error) {
      console.error('Error searching patients by tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchCoursesByTitle = async () => {
    if (!searchInput.trim()) return; 
    setLoading(true);
    try {
      const coursesCollection = collection(db, 'courses');
      const coursesQuery = query(coursesCollection, where('title', '>=', searchInput), where('title', '<=', searchInput + '\uf8ff'));

      const coursesSnapshot = await getDocs(coursesQuery);
      const courseResults: Course[] = [];

      coursesSnapshot.forEach((doc) => {
        const data = doc.data();
        courseResults.push({
          id: doc.id,
          ...data,
          title: data.title
        });
      });

      setCourseResults(courseResults);
      setLastSearchType('course');
    } catch (error) {
      console.error('Error searching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchCoursesByTag = async () => {
    if (!tagSearchInput.trim()) return;
  
    setLoading(true);  // Start loading
  
    try {
      const coursesCollection = collection(db, 'courses');
      const coursesQuery = query(
        coursesCollection,
        where('tag', '==', tagSearchInput.toLowerCase()) 
      );
  
      const coursesSnapshot = await getDocs(coursesQuery);
      const courseResults: Course[] = [];
  
      coursesSnapshot.forEach((doc) => {
        const data = doc.data();
        courseResults.push({
          id: doc.id,
          ...data,
          title: data.title
        });
      });
  
      setCourseResults(courseResults); // Update state with fetched course results
      setLastSearchType('course');  // Set last search type to 'course'
    } catch (error) {
      console.error('Error searching courses by tag:', error);
    } finally {
      setLoading(false);  // End loading
    }
  };

  useEffect(() => {
    if (typeof searchInput === 'string' && searchInput) {
      searchPatientsByName();
      searchCoursesByTitle();
    }
  }, [searchInput]);

  useEffect(() => {
    if (tagSearchInput) {
      searchPatientsByTag();  // Existing patient tag search
      searchCoursesByTag();   // New course tag search
    } else {
      setTagResults([]);
      setCourseResults([]);   // Clear course results when no tag input
    }
  }, [tagSearchInput]);

  // Component for rendering sections (Patients, Courses, Appointments)
  const SectionComponent: React.FC<SectionComponentProps> = ({ 
    title, 
    seeAllRoute, 
    results, 
    loading, 
    noResultText, 
    renderItem 
  }) => (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.titles}>{title}</Text>
        {seeAllRoute && (
          <Pressable onPress={() => router.push(seeAllRoute as any)}>
            <Text style={styles.seeall}> See All</Text>
          </Pressable>
        )}
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.section}>
          {loading ? (
            <Text style={styles.centeredText}>Searching...</Text>
          ) : results.length > 0 ? (
            results.map(renderItem)
          ) : (
            <Text style={styles.centeredText}>{noResultText}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.banner}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={35} color="black" />
        </Pressable>
        <Image 
          source={imageUrl ? { uri: imageUrl } : require('../assets/images/profilePics/dwayneJo.jpg')} // Use fetched image
          style={{ height: 45, width: 45, borderRadius: 90 }}
        />
      </View>

      {/* Search Input for Regular Search */}
      <View style={styles.searchInput}>
        <Input
          defaultValue={searchInput}
          onSearch={(value: React.SetStateAction<string>) => setSearchInput(value)}
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
          defaultValue={tagSearchInput}
          onSearch={(value: React.SetStateAction<string>) => setTagSearchInput(value)}
        />
      </View>

      {/* Patients Search Results */}
      <SectionComponent
      title="Patients"
      seeAllRoute={{
        pathname: '/patient' // Navigate to '/patients' without any parameters
      }}
      results={lastSearchType === 'name' ? patientResults : tagResults}
      loading={loading}
      noResultText="No patients found"
      renderItem={(patient) => (
        <Pressable key={patient.id} onPress={() => router.push(`/PatientDetails?id=${patient.id}`)}>
          <EntityComponent
            imageSource={patient.pictureUrl ? { uri: patient.pictureUrl } : require("../assets/images/profilePics/dwayneJo.jpg")}
            title={`${patient.fname} ${patient.lname}`}
          />
        </Pressable>
      )}
    />

      {/* Courses Search Results */}
      <SectionComponent
        title="Courses"
        seeAllRoute={{
          pathname: '/courses' // Navigate to '/courses' without any parameters
        }}
        results={courseResults}
        loading={loading}
        noResultText="No courses found"
        renderItem={(course) => (
          <Pressable key={course.id} onPress={() => router.push(`/courses?courseid=${course.id}`)}>
            <EntityComponent
              imageSource={course.imageUrl ? { uri: course.imageUrl } : require("../assets/images/courses.png")}
              title={course.title}
            />
          </Pressable>
        )}
      />

      {/* Appointments Search Results */}
      <SectionComponent
        title="Appointments"
        seeAllRoute={{
          pathname: '/calendar'  // Navigates to /calendar for the "See All" button
        }}
        results={appointmentResults}
        loading={loading}
        noResultText="No appointments found"
        renderItem={(appointment) => (
          <Pressable
            key={appointment.id}
            onPress={async () => {
              try {
                // Fetch the patient data based on patientId
                const patientDocRef = doc(db, "Patients", appointment.patientId);
                const patientDocSnap = await getDoc(patientDocRef);

                if (patientDocSnap.exists()) {
                  const patientData = patientDocSnap.data();

                  // Navigate to the appointment page with patient data and appointment info
                  router.push({
                    pathname: "/appointment",
                    params: {
                      patientId: appointment.patientId,
                      time: appointment.time,
                      type: appointment.type,
                      data: JSON.stringify({
                        name: `${patientData.fname} ${patientData.lname}`,
                        symptoms: patientData.symptoms || [], // Ensure symptoms is an array
                        email: patientData.email || '', // Fetch email from patient
                        mobile: patientData.phone || '', // Fetch phone/mobile from patient
                      }),
                    },
                  });
                } else {
                  console.log("No patient found!");
                }
              } catch (error) {
                console.error("Error fetching patient details: ", error);
              }
            }}
          >
            <View style={styles.appointmentContainer}>
              <Image
                source={
                  appointment.patientPFP
                    ? { uri: appointment.patientPFP }
                    : require("../assets/images/profilePics/dwayneJo.jpg")
                }
                style={styles.appointmentImage}
              />
              <Text style={styles.appointmentText}>{appointment.patientName}</Text>
              <Text style={styles.appointmentDate}>
                {new Date(appointment.time).toLocaleDateString()}
              </Text>
            </View>
          </Pressable>
        )}
      />
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
  },
  appointmentContainer: {
    width: 100,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  appointmentImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FF6231',
    marginBottom: 5,
  },
  appointmentText: {
    textAlign: 'center',
    fontSize: 14,
    flexWrap: 'wrap',
    width: '100%',
  },
  appointmentDate: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
  centeredText: {
    marginHorizontal: 25,
    textAlign: 'center',
  },
});
