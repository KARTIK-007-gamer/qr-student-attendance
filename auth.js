import { auth, db } from "./firebase.js";
import { GoogleAuthProvider, signInWithPopup } 
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { ref, set } 
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const provider = new GoogleAuthProvider();

window.googleLogin = function () {
  const role = document.getElementById("role").value;
  const msg = document.getElementById("msg");

  if (!role) {
    msg.innerText = "❌ Please select role first";
    return;
  }

  signInWithPopup(auth, provider)
    .then(result => {
      const user = result.user;

      // Save user data based on role
      set(ref(db, role + "s/" + user.uid), {
        name: user.displayName,
        email: user.email
      });

      // Redirect
      if (role === "teacher") {
        window.location.href = "teacher.html";
      } else {
        window.location.href = "student.html";
      }
    })
    .catch(error => {
      msg.innerText = error.message;
    });
};
