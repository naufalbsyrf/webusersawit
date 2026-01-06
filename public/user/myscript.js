import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
  const _0x12770c = _0x2d52;
  function _0x4cda() {
    const _0x121500 = [
      "3993TTxten",
      "sawit-website.appspot.com",
      "71124zCHFhE",
      "633RytfYs",
      "3019500tIhSoL",
      "1752UQmOib",
      "1:83313894601:web:e244f4377fbe7ee1895918",
      "3342805UcBbNM",
      "47637mAuIKK",
      "210yVRDpk",
      "79246YqytXK",
      "14372GuDiNV",
      "6ncgOwm",
      "83313894601",
      "AIzaSyDOrQCkN2KmbPvaBqH8cq0FbzelJcRDLyM",
      "36834UXnBqm",
      "sawit-website",
    ];
    _0x4cda = function () {
      return _0x121500;
    };
    return _0x4cda();
  }
  (function (_0x303281, _0x53d7da) {
    const _0x5ccd82 = _0x2d52,
      _0x51cf2e = _0x303281();
    while (!![]) {
      try {
        const _0xf1d34c =
          parseInt(_0x5ccd82(0x163)) / 0x1 +
          parseInt(_0x5ccd82(0x15d)) / 0x2 +
          (parseInt(_0x5ccd82(0x15c)) / 0x3) *
            (parseInt(_0x5ccd82(0x164)) / 0x4) +
          (-parseInt(_0x5ccd82(0x160)) / 0x5) *
            (parseInt(_0x5ccd82(0x154)) / 0x6) +
          (parseInt(_0x5ccd82(0x157)) / 0x7) *
            (parseInt(_0x5ccd82(0x15e)) / 0x8) +
          (parseInt(_0x5ccd82(0x161)) / 0x9) *
            (parseInt(_0x5ccd82(0x162)) / 0xa) +
          (-parseInt(_0x5ccd82(0x159)) / 0xb) *
            (parseInt(_0x5ccd82(0x15b)) / 0xc);
        if (_0xf1d34c === _0x53d7da) break;
        else _0x51cf2e["push"](_0x51cf2e["shift"]());
      } catch (_0xfe529d) {
        _0x51cf2e["push"](_0x51cf2e["shift"]());
      }
    }
  })(_0x4cda, 0xc103c);
  function _0x2d52(_0x534a88, _0x150f85) {
    const _0x4cda44 = _0x4cda();
    return (
      (_0x2d52 = function (_0x2d52e9, _0x15f9a5) {
        _0x2d52e9 = _0x2d52e9 - 0x154;
        let _0x17a046 = _0x4cda44[_0x2d52e9];
        return _0x17a046;
      }),
      _0x2d52(_0x534a88, _0x150f85)
    );
  }
  const firebaseConfig = {
    apiKey: _0x12770c(0x156),
    authDomain: "sawit-website.firebaseapp.com",
    projectId: _0x12770c(0x158),
    storageBucket: _0x12770c(0x15a),
    messagingSenderId: _0x12770c(0x155),
    appId: _0x12770c(0x15f),
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const signupButton = document.getElementById("signup-button");
  const signinButton = document.getElementById("signin-button");
  const logoutButton = document.getElementById("logout-button");

  function checkLoginStatus() {
    // Periksa status login pada local storage
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
      location.href = "dashboard.html";
    } else {
      console.log("Not logged in");
    }
  }

  //----------------signup-------------------------
  signupButton.addEventListener("click", async () => {
    const name = document.getElementById("name").value;
    const nohp = document.getElementById("nohp").value;
    const emailSignup = document.getElementById("email_signup").value;
    const passwordSignup = document.getElementById("psw_signup").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailSignup,
        passwordSignup
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        name: name,
        phoneNumber: nohp,
        email: emailSignup,
        password: passwordSignup,
        userId: user.uid,
      });

      alert("User has been successfully created");
    } catch (error) {
      alert(error.message);
    }
  });

  //----------------signin-------------------------
  signinButton.addEventListener("click", async () => {
    const emailSignin = document.getElementById("email_signin").value;
    const passwordSignin = document.getElementById("psw_signin").value;
    console.log("Email:", emailSignin);
    console.log("Password:", passwordSignin);
    try {
      console.log("aaaa");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailSignin,
        passwordSignin
      );
      console.log(userCredential);
      const user = userCredential.user;
      const lgDate = new Date();
      const userDocRef = doc(db, "users", user.uid);

      await updateDoc(userDocRef, {
        last_login: lgDate.toISOString(),
      });

      // Set status login ke local storage
      localStorage.setItem("isLoggedIn", "true");

      location.href = "dashboard.html";
    } catch (error) {
      // Handle authentication errors
      if (error.code === "auth/user-not-found") {
        alert("User not found. Please sign up first.");
      } else {
        alert(error.message);
      }
    }
  });

  //----------------signout-------------------------
  function logout() {
    signOut(auth)
      .then(() => {
        const logoutTime = new Date().toISOString();
        console.log("Waktu logout berhasil dicatat di Firestore:", logoutTime);
        localStorage.setItem("isLoggedIn", "false");
        location.href = "index.html"; // Ganti dengan halaman yang sesuai
      })
      .catch((error) => {
        console.error("Gagal logout:", error);
      });
  }

  logoutButton.addEventListener("click", logout);

  // Periksa status login saat halaman dimuat
  checkLoginStatus();
});
