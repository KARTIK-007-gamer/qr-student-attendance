import { auth, db } from "./firebase.js";
import { ref, get } 
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const lectureSelect = document.getElementById("lectureSelect");
const tableBody = document.querySelector("#attendanceTable tbody");

// Load teacher lectures
auth.onAuthStateChanged(user => {
  if (!user) return;

  get(ref(db, "lectures")).then(snapshot => {
    snapshot.forEach(child => {
      const lecture = child.val();
      if (lecture.teacherId === user.uid) {
        const option = document.createElement("option");
        option.value = child.key;
        option.text = `${lecture.subject} - ${new Date(lecture.startTime).toLocaleTimeString()}`;
        lectureSelect.appendChild(option);
      }
    });
  });
});

window.loadAttendance = function () {
  tableBody.innerHTML = "";
  const lectureId = lectureSelect.value;
  if (!lectureId) return;

  get(ref(db, "attendance/" + lectureId)).then(snapshot => {
    if (!snapshot.exists()) {
      tableBody.innerHTML = "<tr><td colspan='3'>No Attendance</td></tr>";
      return;
    }

    snapshot.forEach(student => {
      const data = student.val();
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${student.key}</td>
        <td>${data.status}</td>
        <td>${new Date(data.time).toLocaleTimeString()}</td>
      `;

      tableBody.appendChild(row);
    });
  });
};

window.goBack = function () {
  window.location.href = "teacher.html";
};
