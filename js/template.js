(function () {
  // Import the functions you need from the SDKs you need
  // import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
  // import {
  //   getDatabase,
  //   ref,
  //   set,
  //   update,
  // } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
  // import {
  //   getAuth,
  //   createUserWithEmailAndPassword,
  //   signInWithEmailAndPassword,
  //   onAuthStateChanged,
  //   signOut,
  // } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAVr8GCpsz2luRAwKKkit6b2ITxshCeVIg",
    authDomain: "login-ffd4f.firebaseapp.com",
    databaseURL: "https://login-ffd4f-default-rtdb.firebaseio.com",
    projectId: "login-ffd4f",
    storageBucket: "login-ffd4f.appspot.com",
    messagingSenderId: "212347808876",
    appId: "1:212347808876:web:b466c1b6d975542a673c49",
  };

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  const auth = firebase.auth();

  SignUp.addEventListener("click", (e) => {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var username = document.getElementById("username").value;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential;

        database.ref("user/" + user.uid).set({
          username: username,
          email: email,
        });
        alert("user created!");

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        alert(errorMessage);
      });
  });
  SignIn.addEventListener("click", (e) => {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var username = document.getElementById("username").value;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential;

        const dt = new Date();
        database.ref("user/" + user.uid).update( {
          last_login: dt,
        });
        console.log(user);
        localStorage.setItem("TaiKhoanDangNhap", username);
        alert("user logged in!");
        load();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  });
  const user = auth.currentUser;
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
  SignOut.addEventListener("click", (e) => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        if (localStorage.getItem("TaiKhoanDangNhap") == null) {
          alert("Bạn hiện đang không đăng nhập");
        } else {
          localStorage.removeItem("TaiKhoanDangNhap");
          location.reload();
        }
      })
      .catch((error) => {
        // An error happened.
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  });
})();
