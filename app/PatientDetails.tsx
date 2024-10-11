import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Image, Dimensions, Alert } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, ActivityIndicator, Provider, Portal, Modal } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Constants from 'expo-constants';
import Markdown from 'react-native-markdown-display';
import { LinearGradient } from "expo-linear-gradient";

interface PatientDetailsProps {
    picture: string;
    name: string;
    gender: string;
    birthdateString: string;
    pronouns: string;
    mobile: string;
    email: string;
    symptoms: string[];
    PatientReport: string;
    tags: string[];
}

const PatientDetails = () => {
    const { id } = useLocalSearchParams(); // Patient ID
    const router = useRouter();
    const [patientData, setPatientData] = useState<PatientDetailsProps | null>(null);

    const [loadingResponse, setLoadingResponse] = useState(false);
    const [response, setResponse] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const KEY = Constants.expoConfig?.extra?.openAI_key;

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const patientDocRef = doc(db, 'Patients', id.toString());
                const patientDocSnap = await getDoc(patientDocRef);

                if (patientDocSnap.exists()) {
                    const data = patientDocSnap.data();

                    const storage = getStorage();
                    const pictureRef = ref(storage, `patientpfp/${id}.png`);
                    let pictureUrl = '';
                    try {
                        pictureUrl = await getDownloadURL(pictureRef);
                    } catch (error) {
                        console.error(`Error fetching picture for patient ${id}:`, error);
                        pictureUrl = '';
                    }

                    const formattedData: PatientDetailsProps = {
                        picture: pictureUrl,
                        name: `${data.fname} ${data.lname}`,
                        gender: data.gender,
                        birthdateString: data.birthdate,
                        pronouns: data.pronouns,
                        mobile: data.phone,
                        email: data.email,
                        symptoms: data.symptoms,
                        PatientReport: data.PatientReport,
                        tags: data.tag,
                    };

                    setPatientData(formattedData);
                } else {
                    console.log('No such patient document!');
                }
            } catch (error) {
                console.error('Error fetching patient details: ', error);
            }
        };

        if (id) {
            fetchPatientDetails();
        }
    }, [id]);

    const getChatGPTResponse = async (patientData: PatientDetailsProps) => {
        setLoadingResponse(true);

        try {
            const messages = [
                {
                    role: "system",
                    content: "You are a doctor providing a detailed professional assessment to another doctor based solely on the provided patient data. Using the given information—including symptoms, patient report, and relevant details—provide a possible diagnosis, suggested treatments, and recommended course of action. Do **not** recommend collecting additional information or conducting further examinations; assume you have all necessary data."
                },
                {
                    role: "user",
                    content: `Here is the patient data:\n\nName: ${patientData.name}\nGender: ${patientData.gender}\nDOB: ${patientData.birthdateString}\nPronouns: ${patientData.pronouns}\nMobile: ${patientData.mobile}\nEmail: ${patientData.email}\nSymptoms: ${patientData.symptoms.join(', ')}\nPatient Report: ${patientData.PatientReport}\nTags: ${patientData.tags.join(', ')}\n\nPlease provide your professional assessment for this patient.`
                }
            ];

            const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: messages,
                    max_tokens: 1000,
                }),
            });

            const data = await apiResponse.json();

            if (!apiResponse.ok) {
                console.error("Error from OpenAI API:", data);
                Alert.alert(
                    "Error",
                    data.error?.message || "An error occurred with OpenAI API"
                );
                setLoadingResponse(false);
                return;
            }

            if (data.choices && data.choices.length > 0) {
                const messageContent = data.choices[0].message.content.trim();
                setResponse(messageContent);
                setModalVisible(true);
            } else {
                console.error("No choices returned from the API. Full response:", data);
                Alert.alert("Error", "No response from OpenAI API");
            }
        } catch (error) {
            console.error("Error fetching response from OpenAI:", error);
            Alert.alert("Error", "Failed to fetch response from OpenAI API");
        }

        setLoadingResponse(false);
    };

    if (!patientData) {
        return (
            <SafeAreaView style={styles.container}>
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
        <Provider>
            <SafeAreaView style={styles.container}>
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

                <Animated.ScrollView entering={FadeIn.delay(100)}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Avatar.Image
                                size={130}
                                source={patientData.picture ? { uri: patientData.picture } : require('../assets/images/postImages/aneta.jpg')}
                                style={styles.avatar}
                            />
                            <Title style={styles.nameHeader}>{patientData.name}</Title>
                            <Paragraph style={styles.detailsText}>Gender: {patientData.gender}</Paragraph>
                            <Paragraph style={styles.detailsText}>DOB: {patientData.birthdateString}</Paragraph>
                            <Paragraph style={styles.detailsText}>Pronouns: {patientData.pronouns}</Paragraph>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.sectionHeader}>Contact Information</Title>
                            <Paragraph style={styles.detailsText}>Mobile: {patientData.mobile}</Paragraph>
                            <Paragraph style={styles.detailsText}>Email: {patientData.email}</Paragraph>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.sectionHeader}>Symptoms</Title>
                            <Paragraph style={styles.detailsText}>{patientData.symptoms.join(', ')}</Paragraph>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.sectionHeader}>Patient Note</Title>
                            <Paragraph style={styles.detailsText}>{patientData.PatientReport}</Paragraph>
                        </Card.Content>
                        <Animated.View entering={FadeIn.delay(550)}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Button
                                    style={styles.button}
                                    icon="account-details"
                                    buttonColor={"#00d4b5"}
                                    mode="contained"
                                    onPress={() => getChatGPTResponse(patientData)}
                                    disabled={loadingResponse}
                                >
                                    {loadingResponse ? "Generating..." : "Stitch Diagnosis"}
                                </Button>
                                <Button
                                    style={styles.button2}
                                    icon="account"
                                    buttonColor={"#00d4b5"}
                                    mode="contained"
                                    onPress={() => router.push({ pathname: './BookAppointment', params: { patientId: id } })}
                                    disabled={loadingResponse}
                                >
                                    {"Book"}
                                </Button>
                            </View>
                        </Animated.View>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.sectionHeader}>Tags</Title>
                            <Paragraph style={styles.detailsText}>{patientData.tags.join(', ')}</Paragraph>
                        </Card.Content>
                    </Card>
                </Animated.ScrollView>

                {/* Modal to display AI Summary */}
                <Portal>
                    <Modal
                        visible={modalVisible}
                        onDismiss={() => setModalVisible(false)}
                        contentContainerStyle={styles.modalContainer}
                    >
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']}
                            style={styles.featherTop}
                        />
                        <Animated.View
                            entering={FadeIn.duration(300)}
                        >
                            <ScrollView showsVerticalScrollIndicator={false} style={styles.responseContainer}>
                                <Markdown>{response}</Markdown>
                            </ScrollView>

                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 1)']}
                                style={styles.featherBottom}
                            />
                        </Animated.View>

                        <Button textColor={"#00d4b5"} onPress={() => setModalVisible(false)}>
                            Close
                        </Button>
                    </Modal>
                </Portal>
            </SafeAreaView>
        </Provider>
    );
};

export default PatientDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
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
    card: {
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: "#d8ebfe"
    },
    avatar: {
        alignSelf: 'center',
        marginBottom: 10,
    },
    nameHeader: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c2c2d',
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c2c2d',
    },
    detailsText: {
        fontSize: 16,
        marginTop: 5,
        color: '#383838',
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
    button: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        width: 160,
        height: 40,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        maxHeight: Dimensions.get('window').height * 0.8,
    },
    responseContainer: {
        maxHeight: Dimensions.get('window').height * 0.6,
        marginBottom: 10,
    },
    responseText: {
        fontSize: 16,
        color: '#000',
    },
    featherTop: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        height: 30,
        zIndex: 1,
    },
    featherBottom: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        height: 20,
        zIndex: 1,
    },
    button2: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        width: 100,
        height: 40,
    },
});
