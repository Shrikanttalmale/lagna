// Firebase config — fully corrected
const firebaseConfig = {
  apiKey: "AIzaSyBfltPGAo5ISaePreDsH5b65sWPM7rNqMo",
  authDomain: "lagna-app-cloud.firebaseapp.com",
  projectId: "lagna-app-cloud",
  storageBucket: "lagna-app-cloud.firebasestorage.app",
  messagingSenderId: "257751969453",
  appId: "1:257751969453:web:dbca2d7e511fcf0e4d6024",
  measurementId: "G-S3BXV6N2FB"
};

console.log(firebaseConfig);


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Login
function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, pass)
    .then(() => window.location = "profiles.html")
    .catch(err => alert("Login failed: " + err.message));
}

// Register
function register() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, pass)
    .then(() => window.location = "profile.html")
    .catch(err => alert("Registration failed: " + err.message));
}

// Logout
function logout() {
  auth.signOut()
    .then(() => window.location = "index.html")
    .catch(err => alert("Logout failed: " + err.message));
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
  }).catch(err => alert("Save failed: " + err.message));
}

// Load profiles and setup DataTable
function loadProfiles() {
  db.collection("profiles").get()
    .then(snapshot => {
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
    })
    .catch(err => alert("Failed to load profiles: " + err.message));
}

// Auth checks — protect pages
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
