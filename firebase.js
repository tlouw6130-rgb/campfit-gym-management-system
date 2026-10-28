// Connects the website to Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// paste YOUR config from the Firebase console here
const firebaseConfig = {
  apiKey: "AIzaSyDMIWjuQC94ea9mv4D18ur8SDPnhu1SAro",
  authDomain: "campfit-b5ccf.firebaseapp.com",
  projectId: "campfit-b5ccf",
  storageBucket: "campfit-b5ccf.firebasestorage.app",
  messagingSenderId: "196348252910",
  appId: "1:196348252910:web:75b45df7a8d254014019ff"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);