import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { isSupported, getAnalytics } from "firebase/analytics";
import Constants from "expo-constants";
import {getFirestore} from "@firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: Constants.expoConfig?.extra?.apiKey,
    authDomain: Constants.expoConfig?.extra?.authDomain,
    projectId: Constants.expoConfig?.extra?.projectId,
    storageBucket: Constants.expoConfig?.extra?.storageBucket,
    messagingSenderId: Constants.expoConfig?.extra?.messagingSenderId,
    appId: Constants.expoConfig?.extra?.appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with AsyncStorage persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initalize Firestore

const db = getFirestore()

// Initialize Firebase Analytics conditionally
let analytics;
if (typeof window !== "undefined") {
    isSupported()
        .then((supported) => {
            if (supported) {
                analytics = getAnalytics(app);
            }
        })
        .catch((error) => {
            console.error("Firebase Analytics not supported:", error);
        });
}

export { app, auth, analytics, db};
