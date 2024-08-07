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
  onAuthStateChanged,
} from "firebase/auth";

const Signup = () => {
  // const router = useRouter();
  const [fName, setFName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const handleSignUp = () => {
    if (password != confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    if (!email || !password || !fName) {
      console.error("Some fields are missing");
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User Logged In: ", user.email);
        router.push("/home");
      } else {
        console.log("User Logged Out");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../assets/images/Logo.png")} />
        <View>
          <Text style={styles.loginText}>
            Create an Account 
          </Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.formText}>
            Sign up now to get started with an account
          </Text>
        </View>
        <View style={styles.form}>
          <Image style={styles.google} source={require("../assets/images/Google.png")} />
          <Button
            title={`Sign Up With Google`}
            onPress={() => {}}
            buttonStyle={undefined}
            textStyle={undefined}
          />
        </View>
        <View style={styles.lineStyle}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>
        <KeyboardAvoidingView style={styles.form} behavior="padding">
          <Text style={styles.label}>Full Name</Text>
          <Input
            placeholder="Enter your full name"
            value={fName}
            onChangeText={(text: string) => setFName(text)}
          />
        </KeyboardAvoidingView>
        <KeyboardAvoidingView style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <Input
            placeholder="Enter your email"
            value={email}
            autoCapitalize="none"
            onChangeText={(text: string) => setEmail(text)}
          />
        </KeyboardAvoidingView>
        <KeyboardAvoidingView style={styles.form} behavior="padding">
          <Text style={styles.label}>Password</Text>
          <Input
            placeholder="Enter your password"
            value={password}
            secureTextEntry
            onChangeText={(text: string) => setPassword(text)}
          />
        </KeyboardAvoidingView>
        <KeyboardAvoidingView style={styles.form} behavior="padding">
          <Text style={styles.label}>Confirm Password</Text>
          <Input
            placeholder="Re-enter your password"
            value={confirmPassword}
            secureTextEntry
            onChangeText={(text: string) => setConfirmPassword(text)} // Check if passwords are equal
          />
        </KeyboardAvoidingView>
        <View style={styles.mainbutton}>
        </View>
        <View style={styles.mainbutton}>
          <MainButton
            title={"Sign Up"}
            onPress={handleSignUp}
            buttonStyle={undefined}
            textStyle={undefined}
          />
        </View>
        
        <View style={styles.footer}>
          <View style={styles.bottomTextContainer}>
            <Text style={styles.footerText}>
              Already have an account?
            </Text>
            <Pressable onPress={()=> router.back()}>
              <Text style={[styles.footerText, styles.signupText]}>
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 11,
    paddingHorizontal: wp(5),
  },
  logo: {
    alignSelf: "center",
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
    top: hp(0.5),
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
    gap: 3,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "semibold",
    color: theme.colors.text,
  },
  lineStyle: {
    flexDirection: "row",
    marginTop: 15,
    marginHorizontal: 15,
    alignItems: "center",
  },
  footer: {
    gap: 30,
    width: "100%",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
