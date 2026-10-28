import {signIn} from "./auth.js";
document.getElementById("signIn").addEventListener("click", async function (){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value 

    if(email === ""){
        alert("Please enter your email");
        return;
    }
    if(password === ""){
        alert("Please enter your password");
        return;
    };
    try{
    await signIn(email, password);
    console.log("signed in successfully");
    window.location.href = "dashboard.html";
    }catch(error){
        console.error("Error signing in:", error);
        alert("Error signing in: " + error.message);
    }
});
