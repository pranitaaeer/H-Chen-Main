// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
// import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  linkWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-dmSWnK8LFX9HW3CJoCK0ammJG9JrJLE",
  authDomain: "chloes-venture.firebaseapp.com",
  projectId: "chloes-venture",
  storageBucket: "chloes-venture.firebasestorage.app",
  messagingSenderId: "1083126960040",
  appId: "1:1083126960040:web:59402dc3f5c4c28336d79d",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
//export
