import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8_iysiRNy1-ASRMEynUm-A6aDx8b4W-4",
  authDomain: "budget-tracker-1b325.firebaseapp.com",
  projectId: "budget-tracker-1b325",
  storageBucket: "budget-tracker-1b325.firebasestorage.app",
  messagingSenderId: "680393961542",
  appId: "1:680393961542:web:427acc6252c465b7535a47",
  measurementId: "G-NKX3ER7C74"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);