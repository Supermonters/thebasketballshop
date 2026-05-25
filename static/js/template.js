(async function () {
  const firebaseConfig = await (await fetch("/firebase-config")).json();

  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  let database = null;

  try {
    database = firebase.database();
  } catch (error) {
    console.warn("Optional database initialization failed:", error);
  }

  function closeModal() {
    document.getElementById("id01").style.display = "none";
  }

  function displayNameFor(user) {
    return user.displayName || (user.email ? user.email.split("@")[0] : "User");
  }

  function refreshLoggedInUi(displayName) {
    localStorage.setItem("TaiKhoanDangNhap", displayName);

    if (typeof load === "function") {
      load();
    }
  }

  function ignoreDatabaseError(action) {
    try {
      Promise.resolve(action()).catch(function (error) {
        console.warn("Optional database action failed:", error);
      });
    } catch (error) {
      console.warn("Optional database action failed:", error);
    }
  }

  // ── Google Sign-In ──────────────────────────────────────────
  GoogleSignIn.addEventListener("click", () => {
    firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then((result) => {
        const user = result.user;
        ignoreDatabaseError(function () {
          return database.ref("user/" + user.uid).set({
            username: displayNameFor(user),
            email: user.email,
            photoURL: user.photoURL || null,
            last_login: new Date().toISOString(),
          });
        });
        refreshLoggedInUi(displayNameFor(user));
        closeModal();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Logged in successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        if (error.code === "auth/popup-closed-by-user") return;
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      });
  });

  // ── Sign Up (email/password) ────────────────────────────────
  SignUp.addEventListener("click", (e) => {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var username = document.getElementById("username").value;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const profileUpdate = username
          ? user.updateProfile({ displayName: username })
          : Promise.resolve();

        ignoreDatabaseError(function () {
          return database.ref("user/" + user.uid).set({
            username: username,
            email: email,
          });
        });

        return profileUpdate.catch(function (error) {
          console.warn("Could not save display name to Auth profile:", error);
        }).then(function () {
          return user.sendEmailVerification();
        }).then(function () {
          return firebase.auth().signOut();
        }).then(function () {
          Swal.fire({
            icon: "success",
            title: "Account created!",
            text: "A verification email has been sent. Please verify your email before logging in.",
          });
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      });
  });

  // ── Sign In (email/password) ────────────────────────────────
  SignIn.addEventListener("click", function () {
    if (localStorage.getItem("TaiKhoanDangNhap") !== null) {
      Swal.fire({ icon: "error", title: "Failed", text: "You are already logged in" });
      return;
    }

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(function (userCredential) {
      var user = userCredential.user;

      if (!user.emailVerified) {
        user.sendEmailVerification();
        firebase.auth().signOut();
        Swal.fire({
          icon: "warning",
          title: "Verify your email",
          text: "A verification link was sent to your email. Please verify before logging in.",
        });
        return;
      }

      var displayName = displayNameFor(user);
      ignoreDatabaseError(function () {
        return database.ref("user/" + user.uid).update({ last_login: new Date().toISOString() });
      });
      refreshLoggedInUi(displayName);
      closeModal();
      console.log("log in successfully");
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Logged in successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    }).catch(function (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    });
  });

  // ── Forgot Password ────────────────────────────────────────
  ForgotPassword.addEventListener("click", (e) => {
    e.preventDefault();
    var email = document.getElementById("email").value;

    if (!email) {
      Swal.fire({
        icon: "info",
        title: "Enter your email",
        text: "Type your email address above, then click Forgot Password.",
      });
      return;
    }

    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Email sent",
          text: "Check your inbox for a password reset link.",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      });
  });

  // ── Auth State Observer ─────────────────────────────────────
  firebase.auth().onAuthStateChanged((user) => {
    if (user && user.emailVerified) {
      refreshLoggedInUi(displayNameFor(user));
    }
  });

  // ── Sign Out ────────────────────────────────────────────────
  SignOut.addEventListener("click", (e) => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        if (localStorage.getItem("TaiKhoanDangNhap") == null) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "You are not logged in",
          });
        } else {
          localStorage.removeItem("TaiKhoanDangNhap");
          location.reload();
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      });
  });
})();
