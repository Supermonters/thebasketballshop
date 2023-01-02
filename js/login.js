function load() {
  if (localStorage.getItem("TaiKhoanDangNhap") == null) {
    return;
  } else {
    var a = localStorage.getItem("TaiKhoanDangNhap");
    document.getElementById("welcomeaido").innerHTML = `Welcome,` + a;
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
