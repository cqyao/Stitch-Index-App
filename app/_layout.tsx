import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from "react";
import SignIn from "@/app/signIn";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require("../assets/fonts/Inter-Regular.ttf"),
    Lato: require("../assets/fonts/Lato-Regular.ttf"),
  });

  const showHeader = false

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
        <Stack initialRouteName={"index"}>
          {/*<Stack.Screen options={{ headerShown: false }} name="app" />*/}

          <Stack.Screen options={{ headerShown: showHeader }} name="index" />
          <Stack.Screen options={{ headerShown: showHeader }} name="signup" />
          <Stack.Screen options={{ headerShown: showHeader }} name="dashboard" />
          <Stack.Screen options={{ headerShown: showHeader }} name="calendar" />
          <Stack.Screen options={{ headerShown: showHeader }} name="appointment" />

        </Stack>
      </GestureHandlerRootView>
  );
}
