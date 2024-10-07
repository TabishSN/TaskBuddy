// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwzmFubM3FDVdE8t2pTyspzW_2INJOmPw",
  authDomain: "PowerPulse-2c6df.firebaseapp.com",
  projectId: "PowerPulse-2c6df",
  storageBucket: "PowerPulse-2c6df.appspot.com",
  messagingSenderId: "49551785421",
  appId: "1:49551785421:web:06c8d0e660c24fa9129884",
  measurementId: "G-E2Z1ZE9YBS"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);