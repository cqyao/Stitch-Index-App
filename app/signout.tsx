import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/firebaseConfig";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

const SignOut: React.FC = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await auth.signOut();
      router.replace({ pathname: "./signIn" });
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign Out</Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        You have been signed out successfully.
      </Text>
      <Button title="Go to Login" onPress={handleSignOut} />
    </View>
  );
};

export default SignOut;
