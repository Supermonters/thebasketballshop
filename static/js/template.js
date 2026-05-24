(async function () {
  const firebaseConfig = await (await fetch("/firebase-config")).json();

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
        const user = userCredential;
        database.ref("user/" + user.uid).set({
          username: username,
          email: email,
        });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Account created successfully",
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

  SignIn.addEventListener("click", (e) => {
    if (localStorage.getItem("TaiKhoanDangNhap") === null) {
      var email = document.getElementById("email").value;
      var password = document.getElementById("password").value;
      var username = document.getElementById("username").value;
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
          const user = userCredential;
          database.ref("user/" + user.uid).update({ last_login: new Date() });
          localStorage.setItem("TaiKhoanDangNhap", username);
          await Swal.fire({
            icon: "success",
            title: "Success",
            text: "Logged in successfully",
          });
          window.location.reload();
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "You are already logged in",
      });
    }
  });

  firebase.auth().onAuthStateChanged((user) => {});

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
