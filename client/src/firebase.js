// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-realestate.firebaseapp.com",
  projectId: "mern-auth-realestate",
  storageBucket: "mern-auth-realestate.appspot.com",
  messagingSenderId: "744576777687",
  appId: "1:744576777687:web:2c9c297c88f23d9cd25f92"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);