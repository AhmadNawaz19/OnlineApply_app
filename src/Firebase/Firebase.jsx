// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaFhWEkCtid3tAXqGc1SQYqc-oOJcYmYc",
  authDomain: "nawaztech1.firebaseapp.com",
  databaseURL: "https://nawaztech1-default-rtdb.firebaseio.com",
  projectId: "nawaztech1",
  storageBucket: "nawaztech1.firebasestorage.app",
  messagingSenderId: "400518564374",
  appId: "1:400518564374:web:d9ac9db4738dd4f8138337",
  measurementId: "G-C0SZXWFGN0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const database = getDatabase(app)