import { auth, db } from "./firebase.js";
import { ref, get, set } 
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
import { signOut } 
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

let scanner;

window.startScan = function () {
  scanner = new Html5Qrcode("scanner");

  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    qrCodeMessage => {
      scanner.stop();
      verifyLecture(qrCodeMessage);
    }
  );
};

function verifyLecture(lectureId) {
  const status = document.getElementById("status");

  get(ref(db, "lectures/" + lectureId)).then(snapshot => {
    if (!snapshot.exists()) {
      status.innerText = "❌ Invalid or Expired QR";
      return;
    }

    const lecture = snapshot.val();

    if (Date.now() > lecture.expiryTime) {
      status.innerText = "❌ QR Expired";
      return;
    }

    navigator.geolocation.getCurrentPosition(position => {
      const distance = getDistance(
        position.coords.latitude,
        position.coords.longitude,
        lecture.latitude,
        lecture.longitude
      );

      if (distance > 30) {
        status.innerText = "❌ You are outside classroom";
        return;
      }

      markAttendance(lectureId);
    });
  });
}

function markAttendance(lectureId) {
  const uid = auth.currentUser.uid;

  set(ref(db, `attendance/${lectureId}/${uid}`), {
    time: Date.now(),
    status: "Present"
  });

  document.getElementById("status").innerText =
    "✅ Attendance Marked Successfully";
}

// 📍 Distance Formula (meters)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2)**2 +
            Math.cos(φ1)*Math.cos(φ2) *
            Math.sin(Δλ/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};
