const firebaseConfig = {
  apiKey: "YOUR-API-KEY",
  authDomain: "YOUR-PROJECT-ID.firebaseapp.com",
  projectId: "YOUR-PROJECT-ID",
  storageBucket: "YOUR-PROJECT-ID.appspot.com",
  messagingSenderId: "YOUR-SENDER-ID",
  appId: "YOUR-APP-ID"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Login
function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, pass)
    .then(() => window.location = "profiles.html")
    .catch(err => alert(err.message));
}

// Register
function register() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, pass)
    .then(() => window.location = "profile.html")
    .catch(err => alert(err.message));
}

// Logout
function logout() {
  auth.signOut().then(() => window.location = "index.html");
}

// Save profile
function saveProfile() {
  const user = auth.currentUser;
  if (!user) {
    alert("Not logged in");
    return;
  }
  db.collection("profiles").doc(user.uid).set({
    name: document.getElementById("name").value,
    age: parseInt(document.getElementById("age").value),
    caste: document.getElementById("caste").value,
    location: document.getElementById("location").value,
    profession: document.getElementById("profession").value
  }).then(() => {
    alert("Profile saved");
    window.location = "profiles.html";
  }).catch(err => alert(err.message));
}

// Load profiles and setup DataTable
function loadProfiles() {
  db.collection("profiles").get().then(snapshot => {
    let rows = "";
    snapshot.forEach(doc => {
      const p = doc.data();
      rows += `<tr>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.caste}</td>
        <td>${p.location}</td>
        <td>${p.profession}</td>
      </tr>`;
    });
    document.getElementById("profilesBody").innerHTML = rows;
    $('#profilesTable').DataTable({
      responsive: true
    });
  });
}

// Auth checks
if (document.location.pathname.includes("index.html")) {
  auth.onAuthStateChanged(user => {
    if (user) window.location = "profiles.html";
  });
}

if (document.location.pathname.includes("profile.html")) {
  auth.onAuthStateChanged(user => {
    if (!user) window.location = "index.html";
  });
}

if (document.location.pathname.includes("profiles.html")) {
  auth.onAuthStateChanged(user => {
    if (user) {
      loadProfiles();
    } else {
      window.location = "index.html";
    }
  });
}
