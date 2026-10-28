import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


const firebaseConfig = {
  apiKey: "AIzaSyDMIWjuQC94ea9mv4D18ur8SDPnhu1SAro",
  authDomain: "campfit-b5ccf.firebaseapp.com",
  projectId: "campfit-b5ccf",
  storageBucket: "campfit-b5ccf.firebasestorage.app",
  messagingSenderId: "196348252910",
  appId: "1:196348252910:web:75b45df7a8d254014019ff"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();