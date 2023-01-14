(function () {
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
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: `Tạo tài khoản thành công`,
        })


        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${errorMessage}`,
        })

      });
  });
  //hello
  SignIn.addEventListener("click", (e) => {
    if (localStorage.getItem('TaiKhoanDangNhap')=== null) {
      var email = document.getElementById("email").value;
      var password = document.getElementById("password").value;
      var username = document.getElementById("username").value;
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential;
  
          const dt = new Date();
          database.ref("user/" + user.uid).update({
            last_login: dt,
          });
          console.log(user);
          localStorage.setItem("TaiKhoanDangNhap", username);
          await Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: `Đăng nhập thành công`,
          })
          window.location.reload();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `${errorMessage}`,
          })
  
        });
    }else{
       Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: `Bạn hiện đang đăng nhập`,
      })
    }

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
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Bạn hiện đang không đăng nhập`,
          })

        } else {
          localStorage.removeItem("TaiKhoanDangNhap");
          location.reload();
        }
      })
      .catch((error) => {
        // An error happened.
        const errorCode = error.code;
        const errorMessage = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${errorMessage}`,
        })

      });
  });
})();
