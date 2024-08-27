import {
    StyleSheet,
    Text,
    View,
    Image,
    Pressable,
    KeyboardAvoidingView,
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
import { auth } from "../firebaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import Animated, {FadeIn, FadeOut, FadeInUp, FadeInDown} from "react-native-reanimated";


const Signup = () => {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(true); // Add a state to switch between sign up and login

    const handleSignUp = () => {
        if (!email || !password) {
            console.error("Email and password are required");
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                console.log("User Signed Up: ", user.email);
                router.push({
                    pathname: "./dashboard",
                });
            })
            .catch((error) => {
                console.error("Error signing up:", error);
            });
    };

    // useEffect(() => {
    //   const unsubscribe = onAuthStateChanged(auth, (user) => {
    //     if (user) {
    //       console.log("User Logged In: ", user.email);
    //       router.push("/home");
    //     } else {
    //       console.log("User Logged Out");
    //     }
    //   });
    //   return unsubscribe;
    // }, []);

    return (
        <ScreenWrapper bg="white">
            <StatusBar style="dark" />
            <View style={styles.container}>
                <Animated.Image entering={FadeInUp.delay(300).duration(1000).springify()} style={styles.logo} source={require("../assets/images/Logo.png")} />
                <Animated.View entering={FadeInUp.delay(500).duration(1000).springify()}>
                    <Text style={styles.loginText}>
                        {isSignUp ? "Sign Up" : "Login to Account"}
                    </Text>
                </Animated.View>
                <View style={styles.form}>
                    <Text style={styles.formText}>
                        {/*{isSignUp*/}
                        {/*    ? "Create a new account"*/}
                        {/*    : "Log in to continue with your account"}*/}
                    </Text>
                </View>
                {/*<Animated.View entering={FadeInUp.delay(600).duration(1000).springify()} style={styles.form}>*/}
                {/*  <Image style={styles.google} source={require("../assets/images/Google.png")} />*/}
                {/*  <Button*/}
                {/*      title={`Sign Up With Google`}*/}
                {/*      onPress={() => {}}*/}
                {/*      buttonStyle={undefined}*/}
                {/*      textStyle={undefined}*/}
                {/*  />*/}
                {/*</Animated.View>*/}
                {/*<Animated.View entering={FadeIn.delay(200).duration(1000).springify()} style={styles.lineStyle}>*/}
                {/*  <View style={styles.line} />*/}
                {/*  <Text style={styles.orText}>OR</Text>*/}
                {/*  <View style={styles.line} />*/}
                {/*</Animated.View>*/}
                <Animated.View entering={FadeInDown.delay(100).duration(1000).springify()}>
                    <KeyboardAvoidingView style={styles.form}>
                        <Text style={styles.label}>Email Address</Text>
                        <Input
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={(text: string) => setEmail(text)}
                        />
                    </KeyboardAvoidingView>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(300).duration(1000).springify()}>
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
                <Animated.View entering={FadeInDown.delay(500).duration(1000).springify()} style={styles.mainbutton}>
                    <MainButton
                        title={"Sign Up"}
                        onPress={handleSignUp}
                        buttonStyle={undefined}
                        textStyle={undefined}
                    />
                </Animated.View>
                <View style={styles.footer}>
                    <Animated.View entering={FadeInDown.delay(700).duration(1000).springify()} style={styles.bottomTextContainer}>
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
        // width: wp(40),
        // height: hp(20),
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
        marginTop: hp(1),
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
        gap: 5,
    },
    lineStyle: {
        flexDirection: "row",
        marginTop: 15,
        marginLeft: 15,
        marginRight: 15,
        alignItems: "center",
    },
    textContainer: {
        marginTop: hp(4), // Adjust this value to increase/decrease the space between "Sign In" button and texts
    },
    footer: {
        gap: 10,
        width: "100%",
        marginTop: hp(2), // Adjust this value to increase/decrease the space between the texts
    },
    bottomTextContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        marginTop: hp(2), // Adjust this value to increase/decrease the space between the texts
    },
    footerText: {
        textAlign: "center",
        color: theme.colors.text,
        fontSize: hp(1.6),
        paddingVertical: 20, // Adjust padding if needed
    },
    forgotPassword: {
        textAlign: "center",
        fontWeight: "semibold",
        color: theme.colors.text,
        // marginTop: hp(1), // Add marginTop to create space below "Forgot Password?"
    },
});

