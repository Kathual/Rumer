import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBCDKlLJcZOuOJ5-TV83JgywkycdRKXxr4",
  authDomain: "college-roommate-app.firebaseapp.com",
  projectId: "college-roommate-app",
  storageBucket: "college-roommate-app.firebasestorage.app",
  messagingSenderId: "785267637157",
  appId: "1:785267637157:web:d694fe22a7d5feb581464c",
  measurementId: "G-0QDYY86457"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore };
