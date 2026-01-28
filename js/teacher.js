import { auth, db } from "./firebase.js";
import { ref, set, remove } 
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
import { signOut } 
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

window.createLecture = function () {
  const subject = document.getElementById("subject").value;
  if (!subject) {
    alert("Enter subject name");
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {
    const lectureId = Date.now();
    const startTime = Date.now();
    const expiryTime = startTime + (2 * 60 * 1000); // 2 minutes

    set(ref(db, "lectures/" + lectureId), {
      teacherId: auth.currentUser.uid,
      subject: subject,
      startTime: startTime,
      expiryTime: expiryTime,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });

    generateQR(lectureId);
    startTimer(expiryTime, lectureId);
  }, () => {
    alert("Location access is required");
  });
};

function generateQR(lectureId) {
  document.getElementById("qrBox").innerHTML = "";
  new QRCode(document.getElementById("qrBox"), {
    text: lectureId.toString(),
    width: 200,
    height: 200
  });
}

function startTimer(expiryTime, lectureId) {
  const timerEl = document.getElementById("timer");

  const interval = setInterval(() => {
    const remaining = expiryTime - Date.now();

    if (remaining <= 0) {
      clearInterval(interval);
      timerEl.innerText = "❌ QR Expired";
      document.getElementById("qrBox").innerHTML = "";
      remove(ref(db, "lectures/" + lectureId));
    } else {
      const sec = Math.floor(remaining / 1000);
      timerEl.innerText = `⏳ Time Left: ${sec}s`;
    }
  }, 1000);
}

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
  window.viewAttendance = function () {
  window.location.href = "attendance.html";
};

};
