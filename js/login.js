function load() {
  let b = document.getElementsByClassName("welcomeUser");
  b[1].style.textAlign = "left";
  b[1].style.fontStyle = "normal";
  if (localStorage.getItem("TaiKhoanDangNhap") == null) {
    return;
  } else {
    var a = localStorage.getItem("TaiKhoanDangNhap");
    b[0].textContent = `Welcome, ${a}`;
    b[1].textContent = `Welcome, ${a}`;
    b[1].style.width = "auto";

  }
}
function cartCounting() {
  var cartItemNumber = 0;
  for (let i = 1; i < 13; i++) {
    if (localStorage.getItem("sp" + i) !== null) {
      cartItemNumber++;
    }
  }
  document.getElementById("countItem").innerHTML = "(" + cartItemNumber + ")";
}
