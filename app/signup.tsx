import {
    StyleSheet,
    Text,
    View,
    Image,
    Pressable,
    KeyboardAvoidingView,
    Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { theme } from "../constants/theme";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { hp, wp } from "../helpers/common";
import Button from "../components/GoogleButton";
import MainButton from "../components/Button";
import Input from "../components/Input";
import { auth, db, storage } from "../firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import ImagePicker from 'react-native-image-picker';
import Animated, {FadeIn, FadeOut, FadeInUp, FadeInDown, FadeOutUp, FadeOutDown} from "react-native-reanimated";
import UploadScreen from "@/components/Uploader";

const Signup = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState(''); // First Name input state
    const [lastName, setLastName] = useState('');   // Last Name input state
    const [isSignUp, setIsSignUp] = useState(true); // Add a state to switch between sign up and login
    const [visible, setVisibleSignup] = useState(false);
    const [visibleV2, setVisibleSignupV2] = useState(false);
    const [visibleV3, setVisibleSignupV3] = useState(false);

    const [loading, setLoading] = useState(false);  // Loading state

    const handleToggle = () => {
        setVisibleSignup(!visible);
        setVisibleSignupV3(!visibleV3);
        handleSignUp();
    };

    const handleToggleV2 = () => {
        setVisibleSignupV2(!visibleV2);
        setVisibleSignup(!visible);
    };

    const handleSignUp = async () => {
        if (!firstName || !lastName || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        setLoading(true);

        try {
            // Create user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user details (First Name and Last Name) in Firestore
            await setDoc(doc(db, 'Users', user.uid), {
                firstName: firstName,
                lastName: lastName,
                email: user.email,
                uid: user.uid,
                createdAt: new Date(),
            });

            router.push({pathname: "./dashboard"})
        } catch (error) {
            console.error('Error signing up:', error);
            Alert.alert('Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper bg="white">
            <StatusBar style="dark" />
            <View style={styles.container}>
                <Animated.Image
                    exiting={FadeOutUp.delay(300).duration(1000).springify()}
                    entering={FadeInUp.delay(300).duration(1000).springify()}
                    style={styles.logo}
                    source={require("../assets/images/Logo.png")}
                />

                {!visibleV2 && (
                    <Animated.View
                        entering={FadeInUp.delay(500).duration(1000).springify()}
                        exiting={FadeOutUp.delay(0).duration(1000).springify()}
                    >
                        <Text style={styles.loginText}>
                            {isSignUp ? "Sign Up" : "Login to Account"}
                        </Text>
                    </Animated.View>
                )}
                {visible && (
                    <Animated.View
                        entering={FadeInUp.delay(500).duration(1000).springify()}
                        exiting={FadeOutUp.delay(0).duration(1000).springify()}
                    >
                        <Text style={styles.loginText}>
                            Welcome {firstName}
                        </Text>
                    </Animated.View>

                )}
                {visibleV3 && (
                    <Animated.View
                        entering={FadeInUp.delay(500).duration(1000).springify()}
                        exiting={FadeOutUp.delay(0).duration(1000).springify()}
                    >
                        <Text style={styles.loginText}>
                            Upload a pfp???
                        </Text>
                    </Animated.View>

                )}
                <View style={styles.form}>
                    <Text style={styles.formText}></Text>
                </View>
                {visible && (
                    <Animated.View
                        entering={FadeInDown.delay(400).duration(1000).springify()}
                        exiting={FadeOutDown.delay(0).duration(1000).springify()}
                    >
                        <KeyboardAvoidingView style={styles.form}>
                            <Text style={styles.label}>Email Address</Text>
                            <Input
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={(text: string) => setEmail(text)}
                            />
                        </KeyboardAvoidingView>
                    </Animated.View>
                )}
                {visible && (
                    <Animated.View
                        entering={FadeInDown.delay(500).duration(1000).springify()}
                        exiting={FadeOutDown.delay(250).duration(1000).springify()}
                    >
                        <KeyboardAvoidingView style={styles.form} behavior="padding">
                            <Text style={styles.label}>Password</Text>
                            <Input
                                placeholder="Enter your password"
                                value={password}
                                secureTextEntry
                                onChangeText={(text: string) => setPassword(text)}
                            />
                        </KeyboardAvoidingView>
                    </Animated.View>
                )}
                {!visibleV2 && (
                    <Animated.View
                        entering={FadeInDown.delay(400).duration(1000).springify()}
                        exiting={FadeOutDown.delay(0).duration(1000).springify()}
                    >
                        <KeyboardAvoidingView style={styles.form}>
                            <Text style={styles.label}>First Name</Text>
                            <Input
                                placeholder="Enter your First Name"
                                value={firstName}
                                onChangeText={(text: string) => setFirstName(text)}
                            />
                        </KeyboardAvoidingView>
                    </Animated.View>
                )}
                {!visibleV2 && (
                    <Animated.View
                        entering={FadeInDown.delay(500).duration(1000).springify()}
                        exiting={FadeOutDown.delay(250).duration(1000).springify()}
                    >
                        <KeyboardAvoidingView style={styles.form} behavior="padding">
                            <Text style={styles.label}>Last Name</Text>
                            <Input
                                placeholder="Last Name"
                                value={lastName}
                                onChangeText={(text: string) => setLastName(text)}
                            />
                        </KeyboardAvoidingView>
                    </Animated.View>
                )}
                {!visibleV2 && (
                    <Animated.View
                        entering={FadeInDown.delay(500).duration(1000).springify()}
                        // exiting={FadeOutDown.delay(500).duration(1000).springify()}
                        style={styles.mainbutton}
                    >
                        <MainButton
                            title={"Sign Up"}
                            onPress={handleToggleV2}
                            buttonStyle={undefined}
                            textStyle={undefined}
                        />
                    </Animated.View>
                )}
                {visibleV3 && (
                    <Animated.View
                        style={styles.pfpPlaceholder}
                        entering={FadeInDown.delay(700).duration(1000).springify()}
                    >
                        <Image source={require('../assets/images/club-penguin-ghosthy.gif')} style={styles.pfpImage} />
                        <UploadScreen/>
                    </Animated.View>
                )}
                {visibleV3 && (
                    <Animated.View
                        entering={FadeInDown.delay(500).duration(1000).springify()}
                        // exiting={FadeOutDown.delay(500).duration(1000).springify()}
                        style={styles.mainbutton}
                    >
                        <MainButton
                            title={"Upload an Image"}
                            // onPress={handleSignUp}
                            buttonStyle={undefined}
                            textStyle={undefined}
                        />
                    </Animated.View>
                )}
                {visibleV3 && (
                    <Animated.View
                        entering={FadeInDown.delay(500).duration(1000).springify()}
                        // exiting={FadeOutDown.delay(500).duration(1000).springify()}
                        style={styles.mainbutton}
                    >
                        <MainButton
                            title={"Sign Up"}
                            // onPress={handleSignUp}
                            buttonStyle={undefined}
                            textStyle={undefined}
                        />
                    </Animated.View>
                )}
                {visible && (
                    <Animated.View
                        // entering={FadeInDown.delay(500).duration(1000).springify()}
                        // exiting={FadeOutDown.delay(500).duration(1000).springify()}
                        style={styles.mainbutton}
                    >
                        <MainButton
                            title={"Sign Up"}
                            onPress={handleToggle}
                            buttonStyle={undefined}
                            textStyle={undefined}
                        />
                    </Animated.View>
                )}
                <View style={styles.footer}>
                    <Animated.View
                        entering={FadeInDown.delay(700).duration(1000).springify()}
                        exiting={FadeOutDown.delay(700).duration(1000).springify()}
                        style={styles.bottomTextContainer}
                    >
                        <Text style={styles.footerText}>
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}
                        </Text>
                        <Pressable onPress={() => router.back()}>
                            <Text style={[styles.footerText, styles.signupText]}>
                                {isSignUp ? "Login" : "Sign-up"}
                            </Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default Signup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15,
        paddingHorizontal: wp(5),
        paddingTop: hp(5),
    },
    logo: {
        alignSelf: "center",
        resizeMode: "contain",
    },
    google: {
        width: wp(8),
        height: hp(4),
        left: wp(14),
        top: hp(2.3),
        position: "absolute",
        justifyContent: "center",
    },
    mainbutton: {
        top: hp(2.5),
    },
    formText: {
        fontSize: hp(1.5),
        color: theme.colors.text,
        textAlign: "center",
        fontFamily: "Inter",
    },
    label: {
        fontSize: hp(1.5),
        color: theme.colors.text,
        textAlign: "left",
        fontFamily: "Inter",
        marginLeft: wp(2),
        marginTop: hp(3),
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "black",
    },
    orText: {
        width: wp(15),
        fontSize: hp(1.5),
        color: theme.colors.text,
        textAlign: "center",
        fontFamily: "Inter",
    },
    loginText: {
        top: hp(2.5),
        fontSize: hp(3),
        fontWeight: "bold",
        color: "#157F86",
        textAlign: "center",
        fontFamily: "Lato",
    },
    signupText: {
        color: theme.colors.primary,
        fontFamily: "Inter",
        fontWeight: "bold",
    },
    form: {
        gap: 10,
    },
    lineStyle: {
        flexDirection: "row",
        marginTop: 15,
        marginLeft: 15,
        marginRight: 15,
        alignItems: "center",
    },
    textContainer: {
        marginTop: hp(4),
    },
    footer: {
        gap: 10,
        width: "100%",
        marginTop: hp(2),
    },
    bottomTextContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        marginTop: hp(2),
    },
    footerText: {
        textAlign: "center",
        color: theme.colors.text,
        fontSize: hp(1.6),
        paddingVertical: 20,
    },
    forgotPassword: {
        textAlign: "center",
        fontWeight: "semibold",
        color: theme.colors.text,
    },
    pfpImage: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
        resizeMode: 'cover', // Adjust if needed
    },
    pfpPlaceholder: {
        alignSelf: "center",
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'transparent', // Adjust background color if necessary
        borderWidth: 2,
        borderColor: '#ddd',
    },
});
