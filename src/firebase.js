// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getApps } from "firebase/app";

// Firebase configuration (Not needed as RNFirebase auto-links)
// const firebaseConfig = { apiKey, authDomain, etc. }; 

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_API_KEY, 
  authDomain: import.meta.env.REACT_APP_AUTH_DOMAIN,
  projectId: import.meta.env.REACT_APP_PROJECT_ID,
  storageBucket: import.meta.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.REACT_APP_APP_ID,
  measurementId: import.meta.env.REACT_APP_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_APP_DB_URL
};

console.log("Database URL:", firebaseConfig.databaseURL);


const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getDatabase(app);
export default app;

