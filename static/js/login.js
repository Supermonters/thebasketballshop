function load() {
  let b = document.getElementsByClassName("welcomeUser");
  b[1].style.textAlign = "left";
  b[1].style.fontStyle = "normal";
  if (localStorage.getItem("TaiKhoanDangNhap") == null) {
    b[0].style.width = '7rem'
    b[1].style.width = "auto";
    return;
  } else {
    var a = localStorage.getItem("TaiKhoanDangNhap");
    b[0].textContent = `Welcome, ${a}`;
    b[1].textContent = `Welcome, ${a}`;
    b[1].style.width = "auto";

  }
}
let pdc;
async function getpdc() {
  pdc = (await ((await fetch("/pdcnt")).json())).count;
}
async function cartCounting() {
  if (!pdc) await getpdc();
  var cartItemNumber = 0;
  for (let i = 1; i <= pdc; i++) {
    if (localStorage.getItem("sp" + i) !== null) {
      cartItemNumber++;
    }
  }
  document.getElementById("countItem").innerHTML = "(" + cartItemNumber + ")";
}
function GuiEmail() {
  Swal.fire({
  icon: "success",
  title: "Đã gửi Email",
  showConfirmButton: false,
  timer: 1500,
});
}