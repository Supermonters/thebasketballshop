function load() {
  if (localStorage.getItem("TaiKhoanDangNhap") == null) {
    return;
  } else {
    var a = localStorage.getItem("TaiKhoanDangNhap");
    let b = document.getElementsByClassName("welcomeUser");
    for (let i = 0; i < b.length; i++){
      b[i].textContent = `Welcome, ${a}`;
      b[i].style.width = 'auto'
  }

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
