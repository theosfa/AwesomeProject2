// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getFunctions } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAE6IvX1fDlh1NYVMaXxWDYoLDm1NaCnPs",
    authDomain: "ooptestingprogram.firebaseapp.com",
    projectId: "ooptestingprogram",
    storageBucket: "ooptestingprogram.appspot.com",
    messagingSenderId: "126116343182",
    appId: "1:126116343182:web:b7563281531602d71f48df",
    measurementId: "G-Q63YV2D5CL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, db, functions };

