import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

const BookAppointment = () => {
    const { patientId } = useLocalSearchParams<{ patientId: string }>();
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [appointmentType, setAppointmentType] = useState<string>('Regular Check-up');

    useEffect(() => {
        const getUserIdFromAsyncStorage = async () => {
            try {
                const userString = await AsyncStorage.getItem("user");
                if (userString) {
                    const userData = JSON.parse(userString);
                    setUserId(userData.uid);
                }
            } catch (error) {
                console.error("Error fetching user ID from AsyncStorage", error);
            }
        };
        getUserIdFromAsyncStorage();
    }, []);

    const onDateSelected = (day: { dateString: React.SetStateAction<string>; }) => {
        setSelectedDate(day.dateString);
        setShowTimePicker(true);
    };

    const onTimeSelected = (event: DateTimePickerEvent, selectedDateTime?: Date) => {
        if (event.type === 'set' && selectedDateTime) {
            const hours = selectedDateTime.getHours();
            const minutes = selectedDateTime.getMinutes();
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            setSelectedTime(timeString);
        }
        setShowTimePicker(false);
    };

    const bookAppointment = async () => {
        if (!selectedDate || !selectedTime) {
            Alert.alert('Please select date and time');
            return;
        }
        try {
            const appointmentData = {
                patientId: patientId,
                status: false,  // Assuming status false means upcoming
                time: `${selectedDate}T${selectedTime}`,
                type: appointmentType,
                doctorId: userId,
            };
            await addDoc(collection(db, 'Appointments'), appointmentData);
            Alert.alert('Appointment booked successfully');
            router.back();
        } catch (error) {
            console.error('Error booking appointment: ', error);
            Alert.alert('Error booking appointment');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Banner */}
            <View style={styles.banner}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={35} color="white" />
                </Pressable>
                <View style={styles.logoContainer}>
                    {/*<Image*/}
                    {/*    source={require('../assets/images/LogoWhite.png')}*/}
                    {/*    resizeMode='contain'*/}
                    {/*    style={styles.logo}*/}
                    {/*/>*/}
                </View>
            </View>
            {/* End of Banner */}
            <Calendar
                onDayPress={onDateSelected}
                markedDates={{
                    [selectedDate]: { selected: true },
                }}
            />
            {showTimePicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onTimeSelected}
                />
            )}
            <View style={styles.selectedContainer}>
                <Text style={styles.selectedText}>Selected Date: {selectedDate || 'None'}</Text>
                <Text style={styles.selectedText}>Selected Time: {selectedTime || 'None'}</Text>
                <TextInput
                    label="Appointment Type"
                    value={appointmentType}
                    onChangeText={text => setAppointmentType(text)}
                    style={styles.input}
                />
            </View>
            <Button
                mode="contained"
                onPress={bookAppointment}
                style={styles.bookButton}
                disabled={!selectedDate || !selectedTime}
            >
                Book Appointment
            </Button>
        </SafeAreaView>
    );
};

export default BookAppointment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    selectedContainer: {
        margin: 20,
    },
    selectedText: {
        fontSize: 18,
        marginVertical: 5,
    },
    bookButton: {
        marginHorizontal: 20,
        backgroundColor: '#00d4b5',
    },
    input: {
        marginTop: 10,
    },
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 10,
        backgroundColor: '#00D6B5',
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
