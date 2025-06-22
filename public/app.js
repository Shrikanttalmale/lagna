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

  const file = document.getElementById("photo").files[0];
  if (!file) {
    alert("Please select a profile photo.");
    return;
  }


  db.collection("profiles").doc(user.uid).set({
    name: document.getElementById("name").value,
    age: parseInt(document.getElementById("age").value),
    caste: document.getElementById("caste").value,
    location: document.getElementById("location").value,
    profession: document.getElementById("profession").value,
annualIncome: document.getElementById("annualIncome").value
  }).then(() => {
    alert("Profile saved");
    window.location = "profiles.html";
  }).catch(err => alert("Save failed: " + err.message));

  const storageRef = storage.ref(`profile_pics/${user.uid}`);
  storageRef.put(file)
    .then(() => storageRef.getDownloadURL())
    .then(url => {
      profileData.photoURL = url;
      return db.collection("profiles").doc(user.uid).set(profileData);
    })
    .then(() => {
      alert("Profile saved");
      window.location = "profiles.html";
    })
    .catch(err => alert("Save failed: " + err.message));
}




// Load profiles and setup DataTable
function loadProfiles() {
  db.collection("profiles").get()
    .then(snapshot => {
      let rows = "";
      snapshot.forEach(doc => {
        const p = doc.data();
      rows += `<tr>
      <td><img src="${p.photoURL}" alt="pic" class="w-10 h-10 rounded-full"/></td>
  <td>${p.name}</td>
  <td>${p.age}</td>
  <td>${p.caste}</td>
  <td>${p.location}</td>
  <td>${p.profession}</td>
  <td>${p.annualIncome || ''}</td>
</tr>`;
      });
      document.getElementById("profilesBody").innerHTML = rows;
      initializeTable();
    })
    .catch(err => alert("Failed to load profiles: " + err.message));
}

// ── NEW: DataTables initializer ──────────────────────────────────────
function initializeTable() {
  $('#profilesTable').DataTable({
    responsive: true,
    pageLength: 10,
    lengthMenu: [5, 10, 20]
  });
}


// AUTO-POPULATE "My Profile" FORM
if (location.pathname.includes("profile.html")) {
  auth.onAuthStateChanged(user => {
    if (!user) return location.href = "index.html";
    db.collection("profiles").doc(user.uid).get()
      .then(doc => {
        if (doc.exists) {
          const d = doc.data();
          ["name","age","caste","location","profession","annualIncome"].forEach(id => {
            document.getElementById(id).value = d[id] || "";
          });
        }
      })
      .catch(err => console.error("Error fetching profile:", err));
  });
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
