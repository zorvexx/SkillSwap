// ✅ Firebase core SDK
import { initializeApp } from "firebase/app";

// ✅ Firebase services
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";      // Realtime Database
import { getFirestore } from "firebase/firestore";    // Firestore

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3GcXDY5vXQATIPGWls-WaB1V1eek38WQ",
  authDomain: "skillswap-5157d.firebaseapp.com",
  projectId: "skillswap-5157d",
  storageBucket: "skillswap-5157d.appspot.com",
  messagingSenderId: "299638855863",
  appId: "1:299638855863:web:2004671304e55939735532",
  measurementId: "G-2MGDSDQETM",
  databaseURL: "https://skillswap-5157d-default-rtdb.firebaseio.com" // for Realtime DB
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Initialize individual services
const auth = getAuth(app);
const database = getDatabase(app);       // Realtime Database
const firestore = getFirestore(app);     // Firestore

// ✅ Export everything
export { app, auth, database, firestore };
