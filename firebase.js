  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
  import { getDatabase } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAqwhNbv6IMzHXLCqCSvZrOEotuM9iGtW0",
    authDomain: "qr-attendance-system-5a2b1.firebaseapp.com",
    databaseURL: "https://qr-attendance-system-5a2b1-default-rtdb.firebaseio.com",
    projectId: "qr-attendance-system-5a2b1",
    storageBucket: "qr-attendance-system-5a2b1.firebasestorage.app",
    messagingSenderId: "623364225106",
    appId: "1:623364225106:web:44af9b70c5984206bbc78b",
    measurementId: "G-SBMKXWY261"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  export const auth = getAuth(app);
  export const db = getDatabase(app);
