import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { hp, wp } from "@/helpers/common";
import Button from "../components/GoogleButton";
import MainButton from "../components/Button";
import Input from "../components/Input";
import { auth } from "@/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { FirebaseError } from "@firebase/app";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // Update the path according to your project


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Add a state to switch between sign up and login
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);


  const checkUserInAsyncStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        // setUser(JSON.parse(storedUser));
        router.push({ pathname: "./dashboard" });
      }
    } catch (error) {
      console.error("Error retrieving user from AsyncStorage", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkUserInAsyncStorage(); // Run check on component mount

    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUser(user);
        // saveUserToAsyncStorage(user); // Optionally save the user on any auth state change
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string; // Firestore timestamp converted to string
    uid: string;
  }

  const saveUserToAsyncStorage = async (user: UserData) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user to AsyncStorage", error);
    }
  };

  const fetchAndStoreUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, "Users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as Omit<UserData, "uid">; // Get Firestore data, excluding 'uid'
        const fullUserData: UserData = {
          ...userData,
          uid,
          createdAt: userData.createdAt, // Convert Firestore timestamp to string
        };
        await saveUserToAsyncStorage(fullUserData);
      } else {
        console.error("No such user document found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore", error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Logged in
      const user = userCredential.user;
      // await saveUserToAsyncStorage(user);
      await fetchAndStoreUserData(user.uid);

      console.log("Logged In With: ", user.email);
      router.push({ pathname: "./dashboard" });
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        // Check for Firebase Auth error codes
        switch (error.code) {
          case "auth/email-already-in-use":
            Alert.alert("Error", "The email address is already in use.");
            break;
          case "auth/invalid-email":
            Alert.alert("Error", "The email address is invalid.");
            break;
          case "auth/operation-not-allowed":
            Alert.alert("Error", "Email/password accounts are not enabled.");
            break;
          case "auth/weak-password":
            Alert.alert("Error", "The password is too weak.");
            break;
          case "auth/user-not-found":
            Alert.alert("Error", "User not found.");
            break;
          case "auth/wrong-password":
            Alert.alert("Error", "Incorrect password.");
            break;
          default:
            Alert.alert(
              "Error",
              "Incorrect Email or Password. Please try again."
            );
            break;
        }
      } else {
        console.error("Unknown error signing in:", error);
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
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
        <Animated.Image
          entering={FadeInUp.delay(200).duration(1000).springify()}
          style={styles.logo}
          source={require("../assets/images/Logo.png")}
        />
        <Animated.View
          entering={FadeInUp.delay(400).duration(1000).springify()}
        >
          <Text style={styles.loginText}>{isSignUp ? "Sign Up" : "Login"}</Text>
        </Animated.View>
        <View style={styles.form}>
          <Text style={styles.formText}>
            {/*{isSignUp*/}
            {/*    ? "Create a new account"*/}
            {/*    : "Log in to continue with your account"}*/}
          </Text>
        </View>
        <Animated.View
          entering={FadeInUp.delay(600).duration(1000).springify()}
          style={styles.form}
        >
        {/* Google sign-in */}
        <Image
          style={styles.google}
          source={require("../assets/images/Google.png")}
        />
        <Button
          title={`Sign in With Google`}
          buttonStyle={undefined}
          textStyle={undefined}
        />
        </Animated.View>
        <Animated.View
          entering={FadeIn.delay(200).duration(1000).springify()}
          style={styles.lineStyle}
        >
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(1000).springify()}>
          <KeyboardAvoidingView style={styles.form}>
            <Text style={styles.label}>Email Address</Text>
            <Input
              placeholder="Enter your email"
              value={email}
              onChangeText={(text: string) => setEmail(text)}
            />
          </KeyboardAvoidingView>
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(200).duration(1000).springify()}
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
        <Animated.View
          entering={FadeInDown.delay(400).duration(1000).springify()}
          style={styles.mainbutton}
        >
          <MainButton
            title={"Sign In"}
            onPress={handleLogin}
            buttonStyle={undefined}
            textStyle={undefined}
          />
        </Animated.View>
        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.delay(600).duration(1000).springify()}
            style={styles.bottomTextContainer}
          >
            <Text style={styles.footerText}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </Text>
            <Pressable onPress={() => router.push({ pathname: "./signup" })}>
              <Text style={[styles.footerText, styles.signupText]}>
                {isSignUp ? "Login" : "Sign-up"}
              </Text>
            </Pressable>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(800).duration(1000).springify()}
          >
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignIn;

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
