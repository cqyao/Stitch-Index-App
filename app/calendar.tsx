import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList
} from "react-native";
import React, { useRef, useState, useEffect, } from "react";
import { Calendar } from "react-native-calendars";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import MainButton from "../components/Button";
import { useRouter } from "expo-router";
import AppointmentCard from "@/components/AppointmentCard";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDocs, collection } from "firebase/firestore";
import { app, db } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn } from "react-native-reanimated";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { toZonedTime, format } from 'date-fns-tz';

type AppointmentProps = {
  id: string; // Include the ID for each appointment
  patientId: string;
  status: boolean;
  time: string;
  type: string;
};

export default function CalendarPage() {
  const timeZone = 'Australia/Sydney';
  const currentDate = new Date()
  const zonedDate = toZonedTime(currentDate, timeZone)
  const formattedCurrentDate = format(zonedDate, 'yyyy-MM-dd', { timeZone });
  const router = useRouter();
  // Date states
  const [selectedDate, setSelectedDate] = useState(formattedCurrentDate);
  // Fold up menu states
  const sheetRef = useRef<BottomSheet>(null);
  // for determining whether the fold up menu is open or not
  const [isOpen, setIsOpen] = useState(true);
  // for determining whether "completed" or "upcoming" button is selected
  const [isSelected, setIsSelected] = useState(false);
  // Where the fold up menu snaps
  const snapPoints = ["45%", "90%"];
  const [appointments, setAppointments] = useState<AppointmentProps[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentProps[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchImageUrl = async (userID: string) => {
    try {
      const url = await fetchImageFromFirebase(`pfp/${userID}`);
      if (url) setImageUrl(url); 
    } catch (error) {
      console.error("Error fetching image URL:", error);
    }
  };

  const fetchImageFromFirebase = async (
    path: string
  ): Promise<string | null> => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, path);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error fetching image from Firebase Storage", error);
      return null;
    }
  };

  const getUserIdFromAsyncStorage = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        setUserId(userData.uid);
        await fetchImageUrl(userData.uid);
      }
    } catch (error) {
      console.error("Error fetching user ID from AsyncStorage", error);
    }
  };

  const fetchAllAppointments = async () => {
    try {
      const appointmentsCollection = collection(db, "Appointments");
      const querySnapshot = await getDocs(appointmentsCollection);

      const appointmentsList: AppointmentProps[] = querySnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      ) as AppointmentProps[];

      setAppointments(appointmentsList);
      setFilteredAppointments(appointmentsList.filter(appointment => appointment.status === isSelected));
    } catch (error) {
      console.error("Error fetching Appointments: ", error);
    }
  };
  
  const filterAppointmentsByStatus = async (status: boolean) => {
    //console.log("Status: ", status, " Appointments: ", appointments)
    const filteredAppointments = appointments.filter(appointment => {
      const appointmentDate = appointment.time.split("T")[0]; // Extract the date part from the appointment's time
      return appointment.status === status && appointmentDate === selectedDate;
    });
    console.log("Filtered app'ts: ", filteredAppointments)
    setFilteredAppointments(filteredAppointments);
  };

  useEffect(() => {
    fetchAllAppointments();
    filterAppointmentsByStatus(false);
    getUserIdFromAsyncStorage();
  }, []);

  useEffect(() => {
    filterAppointmentsByStatus(isSelected);
  }, [selectedDate])

  return (
    <View style={{ flex: 1, backgroundColor: "#02D6B6" }}>
      <View style={styles.banner}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={35} color="white" />
        </Pressable>
        <Image
          source={require("../assets/images/LogoWhite.png")}
          resizeMode="contain"
          style={styles.logo}
        />
        {imageUrl && (
          <Animated.Image
            entering={FadeIn.delay(500)}
            source={{ uri: imageUrl || undefined }}
            style={{ height: 45, width: 45, borderRadius: 90 }}
          />
        )}
      </View>
      <Calendar
        // Style
        style={[styles.calendar, { opacity: isOpen ? 0.2 : 1 }]}
        // Theme editing
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#02D6B6",
          textSectionTitleColor: "#ffffff",
          textSectionTitleDisabledColor: "#d9e1e8",
          selectedDayBackgroundColor: "#ffffff",
          selectedDayTextColor: "#02D6B6",
          todayTextColor: "#ffffff",
          dayTextColor: "#ffffff",
          textDisabledColor: "#d9e1e8",
          dotColor: "#00adf5",
          selectedDotColor: "#02D6B6",
          arrowColor: "#ffffff",
          disabledArrowColor: "#d9e1e8",
          monthTextColor: "#ffffff",
          indicatorColor: "#ffffff",
          textDayFontFamily: "Inter",
          textMonthFontFamily: "Lato",
          textDayHeaderFontFamily: "Lato",
          textDayFontWeight: "500",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "300",
          textDayFontSize: 16,
          textMonthFontSize: 26,
          textDayHeaderFontSize: 16,
        }}
        // Setup the marked dates feature to be the date selected by user (NOTE** We will also have to set up marked dates for appoinment dates)
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: "white",
          },
          ...appointments.reduce((acc, appointment) => {
            const appointmentDate = appointment.time.split("T")[0];
            acc[appointmentDate] = {
              marked: true,
              dotColor: "pink",
              selected: appointmentDate === selectedDate,
              selectedColor: appointmentDate === selectedDate ? "white" : undefined,
            };
            return acc;
          }, {})
        }}
        // On Date Changed Functions -> We can use this to gather the current selectd date to search for appointments
        onDayPress={(day) => {
          console.log("Selected day: ", day.dateString);
          setSelectedDate(day.dateString);
        }}
        onMonthChange={(month) => {
          console.log("Month changed to: ", month);
        }}
        onPressArrowLeft={(subtractMonth) => subtractMonth()}
        onPressArrowRight={(addMonth) => addMonth()}
      />
      {/* This is some scroll menu settings*/}
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        style={styles.slide}
        enablePanDownToClose={false}
        onChange={() => (isOpen ? setIsOpen(false) : setIsOpen(true))}
      >
        {/* This is the scroll up menu */}
        <BottomSheetView style={{ flex: 1 }}>
          <View style={styles.container}>
            <View>
              <Text style={styles.appText}>Appointments</Text>
            </View>
            <View style={styles.toggle}>
              <View>
                <MainButton
                  title={"Completed"}
                  buttonStyle={[
                    styles.buttonStyle,
                    { backgroundColor: isSelected ? "#02D6B6" : "#d9e1e8" },
                  ]}
                  textStyle={[
                    styles.buttonText,
                    { color: isSelected ? "#ffffff" : "#808080" },
                  ]}
                  onPress={() => {
                    filterAppointmentsByStatus(true);
                    setIsSelected(true);
                  }}
                />
              </View>
              <View>
                <MainButton
                  title={"Upcoming"}
                  buttonStyle={[
                    styles.buttonStyle,
                    { backgroundColor: isSelected ? "#d9e1e8" : "#02D6B6" },
                  ]}
                  textStyle={[
                    styles.buttonText,
                    { color: isSelected ? "#808080" : "#ffffff" },
                  ]}
                  onPress={() => {
                    filterAppointmentsByStatus(false);
                    setIsSelected(false);
                  }}
                />
              </View>
            </View>
          </View>

          {/*This is the beginning of the appointments list*/}
          <FlatList
            data={filteredAppointments}
            keyExtractor={(item) => item.id}
            extraData={filteredAppointments}
            renderItem={({ item }) => (
              <AppointmentCard
                key={item.id}
                patientId={item.patientId}
                status={item.status}
                time={item.time.toString()}
                type={item.type}
              />
            )}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    marginTop: -45,
  },
  logo: {
    width: 200,
    height: 70,
  },
  slide: {
    marginTop: 50,
    marginHorizontal: 10,
  },
  toggle: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
    backgroundColor: "#d9e1e8",
    borderRadius: 90,
    height: 40,
    alignItems: "center",
    alignSelf: "center",
  },
  container: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 15,
    paddingBottom: 20,
    marginVertical: 15,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  buttonStyle: {
    height: 30,
    width: 150,
    margin: 10,
  },
  buttonBacking: {
    backgroundColor: "#808080",
  },
  appText: {
    fontWeight: "bold",
    color: "#157F86",
    fontSize: 20,
    alignSelf: "center",
  },
  profilePic: {
    position: "absolute", // Position it absolutely within its container
    top: 55, // Adjust as needed
    right: 25, // Adjust as needed
    padding: 5,
    borderColor: "#ffffff",
    borderRadius: 45,
    borderWidth: 2,
  },
  backArrow: {
    position: "absolute", // Position it absolutely within its container
    top: 55, // Adjust as needed
    left: 25, // Adjust as needed
    padding: 5,
    color: "#ffffff",
  },
  timeText: {
    color: "#7D7D7D",
    fontSize: 14,
    fontWeight: "bold",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "#00D6B5",
  },
});
