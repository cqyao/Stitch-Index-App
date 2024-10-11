import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { DrawerItem } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/firebaseConfig";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [loaded, error] = useFonts({
    Inter: require("../assets/fonts/Inter-Regular.ttf"),
    Lato: require("../assets/fonts/Lato-Regular.ttf"),
  });

  const showHeader = false;

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer initialRouteName="dashboard" backBehavior="history">
        <Drawer.Screen
          name="index"
          options={{ headerShown: false, drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="dashboard"
          options={{
            drawerLabel: "Home",
            headerShown: false,
            drawerPosition: "right",
          }}
        />
        <Drawer.Screen
          name="appointment"
          options={{
            drawerLabel: "Appointments",
            headerShown: false,
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="patient"
          options={{
            drawerLabel: "Patients",
            headerShown: false,
            drawerPosition: "right",
          }}
        />
        <Drawer.Screen
          name="calendar"
          options={{
            drawerLabel: "Calendar",
            headerShown: false,
            drawerPosition: "right",
          }}
        />
        <Drawer.Screen
          name="research"
          options={{
            drawerLabel: "Research",
            headerShown: false,
            drawerPosition: "right",
          }}
        />
        <Drawer.Screen
          name="courses"
          options={{
            drawerLabel: "Courses",
            headerShown: false,
            drawerPosition: "right",
          }}
        />
        <Drawer.Screen
          name="signout"
          options={{
            drawerLabel: "Sign Out",
            headerShown: false,
            drawerPosition: "right",
          }}
        />
        <Drawer.Screen
          name="post"
          options={{ headerShown: false, drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="signIn"
          options={{ headerShown: false, drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="signup"
          options={{ headerShown: false, drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="search"
          options={{ headerShown: false, drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="courseContents"
          options={{ headerShown: false, drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="createCourse"
          options={{ headerShown: false, drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="PatientDetails"
          options={{ headerShown: false, drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="createpost"
          options={{ headerShown: false, drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="seeall"
          options={{ headerShown: false, drawerItemStyle: { display: "none" } }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
