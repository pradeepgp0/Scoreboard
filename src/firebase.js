import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkfyvXk7w00ui8PoKN0uFN6frBvJpaL0E",
  authDomain: "scoreboard-44709.firebaseapp.com",
  projectId: "scoreboard-44709",
  storageBucket: "scoreboard-44709.firebasestorage.app",
  messagingSenderId: "512684066053",
  appId: "1:512684066053:web:97884d05c685275d34236c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);


// Export firestore and document methods if needed elsewhere
export { db, doc, setDoc, getDoc, updateDoc };
