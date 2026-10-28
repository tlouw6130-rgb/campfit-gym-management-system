import {authorisation,db} from "./firebase_lesson/config.js";

import{
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";
export async function signUp(email, password, username) {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
            email: email,
            username: username
        });
        console.log("User created successfully");
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}
export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in successfully");
        return userCredential;
    } catch (error) {
        console.error("Error signing in:", error);
        throw error;
    }
}
export async function resetPassword(email, newPassword) {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth, 
            email,
            newPassword
            
        );
        const user = userCredential.user;
        return user;
    } catch (error) {
        console.error("Error resetting password:", error);
        throw error;
    }
}
