import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import MainButton from "../components/Button";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Link, useNavigation, useRouter } from "expo-router";
import { todayString } from 'react-native-calendars/src/expandableCalendar/commons';

export default function CalendarPage() {

    const router = useRouter();

    // Date states
    const [selectedDate, setSelectedDate] = useState();

    // Fold up menu states
    const sheetRef = useRef<BottomSheet>(null);

    // for determining whether the fold up menu is open or not
    const [isOpen, setIsOpen] = useState(true);

    // for determining whether "completed" or "upcoming" button is selected
    const [isSelected, setIsSelected] = useState(false);

    // Where the fold up menu snaps
    const snapPoints = ["50%", "91%"];

    return (
        <View style={{flex: 1,backgroundColor: '#02D6B6'}}>
            <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
                <MaterialIcons name="arrow-back-ios" size={40} color="#ffffff" />
            </TouchableOpacity>
            <Image style={styles.logo} resizeMode="contain" source={require('../assets/images/LogoWhite.png')}/>
            <TouchableOpacity style={styles.profilePic} onPress={() => router.back()}>
                <MaterialIcons name="face" size={40} color="black" />
            </TouchableOpacity>
            <Calendar 
                // Style
                style={[styles.calendar, {opacity: isOpen ? 0.2 : 1}]}

                // Theme editing
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#02D6B6',
                    textSectionTitleColor: '#ffffff',
                    textSectionTitleDisabledColor: '#d9e1e8',
                    selectedDayBackgroundColor: '#ffffff',
                    selectedDayTextColor: '#02D6B6',
                    todayTextColor: '#ffffff',
                    dayTextColor: '#ffffff',
                    textDisabledColor: '#d9e1e8',
                    dotColor: '#00adf5',
                    selectedDotColor: '#ffffff',
                    arrowColor: '#ffffff',
                    disabledArrowColor: '#d9e1e8',
                    monthTextColor: '#ffffff',
                    indicatorColor: '#ffffff',
                    textDayFontFamily: 'Inter',
                    textMonthFontFamily: 'Lato',
                    textDayHeaderFontFamily: 'Lato',
                    textDayFontWeight: '500',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 16,
                    textMonthFontSize: 26,
                    textDayHeaderFontSize: 16

                  }}

                // Setup the marked dates feature to be the date selected by user (NOTE** We will also have to set up marked dates for appoinment dates)
                markedDates={{
                    [selectedDate]: { selected: true, marked: false, selectedColor: '#ffffff' },
                }}

                // On Date Changed Functions -> We can use this to gather the current selectd date to search for appointments
                onDayPress={day => {
                    console.log('selected day', day);
                    setSelectedDate(day.dateString);
                }}
                onMonthChange={month => {
                    console.log('month changed', month);
                }}
                onPressArrowLeft={subtractMonth => subtractMonth()}
                onPressArrowRight={addMonth => addMonth()}

            />
            {/* This is some scroll menu settings*/}
            <BottomSheet
                ref={sheetRef}
                snapPoints={snapPoints}
                style={styles.slide}
                enablePanDownToClose={false}
                onChange={() => isOpen ? setIsOpen(false) : setIsOpen(true)}
            >
                {/* This is the scroll up menu */}
                <BottomSheetView style={{flex: 1}}>
                <View style={styles.container}>
                    <View>
                        <Text style={styles.appText}>Appointments</Text>
                    </View>
                    <View style={styles.toggle}>
                        <View>
                            <MainButton
                                title={"Completed"}
                                buttonStyle={[styles.buttonStyle, {backgroundColor: isSelected ? '#02D6B6' : '#d9e1e8'}]}
                                textStyle={[styles.buttonText, {color: isSelected ? '#ffffff' : '#808080'}]}
                                onPress={() => setIsSelected(true)}
                            />
                        </View>
                        <View>
                            <MainButton
                                title={"Upcoming"}
                                buttonStyle={[styles.buttonStyle, {backgroundColor: isSelected ? '#d9e1e8' : '#02D6B6'}]}
                                textStyle={[styles.buttonText, {color: isSelected ? '#808080' : '#ffffff'}]}
                                onPress={() => setIsSelected(false)}
                            />
                        </View>
                    </View>
                    </View>

                    {/*This is the beginning of the scroll view*/}
                    <ScrollView>

                    {/*This is an appointment object to demonstrate appointment populating*/}
                    <View style={styles.container}>
                        <View style={{flexDirection: "row"}}>
                            <MaterialIcons style={{padding: 1}} name="access-time" size={15} color="#7D7D7D" />
                            <Text style={styles.timeText}>Time</Text>
                        </View>
                        <View style={{marginTop: 4, borderBottomColor: 'orange', borderBottomWidth: 2,}}/>
                        <View style={{flexDirection: "row"}}>
                            <MaterialIcons style={{marginTop: 10,}}name="face" size={60} color="black" />
                            <Text style={[styles.timeText, {marginTop: 20, marginLeft: 10,}]}>Name</Text>
                            <TouchableOpacity style={{marginTop: 20, marginLeft: 130,}} onPress={() => router.back()}>
                                <MaterialIcons name="arrow-forward-ios" size={40} color="#808080" />
                            </TouchableOpacity>
                        </View>
                            <Text style={[styles.timeText, {marginTop: -30, marginLeft: 70, color: '#808080', fontWeight: 'normal'}]}>Appointment Type</Text>
                            <View style={{marginTop: 20, borderBottomColor: 'orange', borderBottomWidth: 2,}}/>
                    </View>

                    {/*This is an appointment object to demonstrate appointment populating*/}
                    <View style={styles.container}>
                        <View style={{flexDirection: "row"}}>
                            <MaterialIcons style={{padding: 1}} name="access-time" size={15} color="#7D7D7D" />
                            <Text style={styles.timeText}>Time</Text>
                        </View>
                        <View style={{marginTop: 4, borderBottomColor: 'orange', borderBottomWidth: 2,}}/>
                        <View style={{flexDirection: "row"}}>
                            <MaterialIcons style={{marginTop: 10,}}name="face" size={60} color="black" />
                            <Text style={[styles.timeText, {marginTop: 20, marginLeft: 10,}]}>Name</Text>
                            <TouchableOpacity style={{marginTop: 20, marginLeft: 130,}} onPress={() => router.back()}>
                                <MaterialIcons name="arrow-forward-ios" size={40} color="#808080" />
                            </TouchableOpacity>
                        </View>
                            <Text style={[styles.timeText, {marginTop: -30, marginLeft: 70, color: '#808080', fontWeight: 'normal'}]}>Appointment Type</Text>
                            <View style={{marginTop: 20, borderBottomColor: 'orange', borderBottomWidth: 2,}}/>
                    </View>

                    {/*This is an appointment object to demonstrate appointment populating*/}
                    <View style={styles.container}>
                        <View style={{flexDirection: "row"}}>
                            <MaterialIcons style={{padding: 1}} name="access-time" size={15} color="#7D7D7D" />
                            <Text style={styles.timeText}>Time</Text>
                        </View>
                        <View style={{marginTop: 4, borderBottomColor: 'orange', borderBottomWidth: 2,}}/>
                        <View style={{flexDirection: "row"}}>
                            <MaterialIcons style={{marginTop: 10,}}name="face" size={60} color="black" />
                            <Text style={[styles.timeText, {marginTop: 20, marginLeft: 10,}]}>Name</Text>
                            <TouchableOpacity style={{marginTop: 20, marginLeft: 130,}} onPress={() => router.back()}>
                                <MaterialIcons name="arrow-forward-ios" size={40} color="#808080" />
                            </TouchableOpacity>
                        </View>
                            <Text style={[styles.timeText, {marginTop: -30, marginLeft: 70, color: '#808080', fontWeight: 'normal'}]}>Appointment Type</Text>
                            <View style={{marginTop: 20, borderBottomColor: 'orange', borderBottomWidth: 2,}}/>
                    </View>

                    {/*This is an appointment object to demonstrate appointment populating*/}
                    <View style={styles.container}>
                        <View style={{flexDirection: "row"}}>
                            <MaterialIcons style={{padding: 1}} name="access-time" size={15} color="#7D7D7D" />
                            <Text style={styles.timeText}>Time</Text>
                        </View>
                        <View style={{marginTop: 4, borderBottomColor: 'orange', borderBottomWidth: 2,}}/>
                        <View style={{flexDirection: "row"}}>
                            <MaterialIcons style={{marginTop: 10,}}name="face" size={60} color="black" />
                            <Text style={[styles.timeText, {marginTop: 20, marginLeft: 10,}]}>Name</Text>
                            <TouchableOpacity style={{marginTop: 20, marginLeft: 130,}} onPress={() => router.back()}>
                                <MaterialIcons name="arrow-forward-ios" size={40} color="#808080" />
                            </TouchableOpacity>
                        </View>
                            <Text style={[styles.timeText, {marginTop: -30, marginLeft: 70, color: '#808080', fontWeight: 'normal'}]}>Appointment Type</Text>
                            <View style={{marginTop: 20, borderBottomColor: 'orange', borderBottomWidth: 2,}}/>
                    </View>

                    </ScrollView>
                </BottomSheetView>
            </BottomSheet>
        </View>     
    )

};

const styles = StyleSheet.create({
    calendar: {
        marginTop: -40,
    },
    logo: {
        alignSelf: "center",
        flex: 0.3,
        height: "45%",
        width: "45%",
    },
    slide: {
        marginTop: 50,
        marginHorizontal: 10,
    },
    toggle: {
        flexDirection:"row", 
        marginTop: 15,
        justifyContent: 'center',
        backgroundColor: '#d9e1e8',
        borderRadius: 17,
    },
    container: {
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 12,
        marginHorizontal: 15,
        borderWidth: 1.2,
        borderColor: "#02D6B6",
        paddingBottom: 20,
        marginVertical: 15,
    },
    buttonText: {
        padding: 10,
        fontSize: 15,
        fontWeight: 'bold',
    },
    buttonStyle: {
        height: 50,
        width: 150,
        marginHorizontal: 3,
    },
    buttonBacking: {
        backgroundColor: '#808080',
    },
    appText: {
        fontWeight: 'bold',
        color: '#157F86',
        fontSize: 20,
    },
    profilePic: {
        position: 'absolute', // Position it absolutely within its container
        top: 55, // Adjust as needed
        right: 25, // Adjust as needed
        padding: 5,
        borderColor: '#ffffff',
        borderRadius: 45,
        borderWidth: 2,
    },
    backArrow: {
        position: 'absolute', // Position it absolutely within its container
        top: 55, // Adjust as needed
        left: 25, // Adjust as needed
        padding: 5,
        color: '#ffffff',
    },
    timeText: {
        color: '#7D7D7D',
        fontSize: 14,
        fontWeight: 'bold',
    }
})