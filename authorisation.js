import {auth , db } from "../firebase_lesson/config.js";


import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

export async function registerUser(email, password, username) {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth, 
            email,
             password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
            email: userCredential.user.email,
            username,
        });
        return userCredential;
    } catch (error) {
        throw error;
    }
    
}
const user = userCredential.user;


await setDoc(doc(db, "users", user.uid), {
    UID: user.UID,
    user
});
if (userCredential) {
    console.log("User registered successfully:", userCredential.user);
}

import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function showError(text) {
  document.getElementById("error").innerText = text;
}

// ---------- login ----------
window.login = async function () {
  var email = document.getElementById("email").value.trim();
  var password = document.getElementById("password").value;
  if (email == "" || password == "") {
    showError("Please fill in both fields");
    return;
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (err) {
    showError("Wrong email or password");
    console.log(err.code);
  }
};

// ---------- sign up ----------
window.signup = async function () {
  var username = document.getElementById("username").value.trim();
  var email = document.getElementById("email").value.trim();
  var password = document.getElementById("password").value;
  var confirm = document.getElementById("confirm").value;

  if (username == "" || email == "" || password == "") {
    showError("Please fill in all fields");
    return;
    
  }
  if (password != confirm) {
    showError("Passwords do not match");
    return;
  }
  try {
    var result = await createUserWithEmailAndPassword(auth, email, password);
    // save the extra info in Firestore, using the user's id as the document name
    await setDoc(doc(db, "users", result.user.uid), {
      username: username,
      email: email,
      role: "admin"
    });
    alert("Account created!");
    window.location.href = "dashboard.html";
  } catch (err) {
    console.log(err.code);
    if (err.code == "auth/email-already-in-use") showError("That email is already registered");
    else if (err.code == "auth/weak-password") showError("Password must be at least 6 characters");
    else showError("Could not create account. Check the console.");
  }
};

// ---------- forgot password ----------
window.resetPassword = async function () {
  var email = document.getElementById("email").value.trim();
  if (email == "") {
    showError("Enter your email");
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    alert("If that email has an account, a reset link has been sent. Check your inbox and spam.");
    window.location.href = "index.html";
  } catch (err) {
    console.log(err.code);
    showError("Could not send the reset email");
  }
};
