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
    b[0].style.width = "auto";
    b[1].style.width = "auto";

    // Disable the login modal trigger on the nav link when logged in
    b[0].onclick = (e) => e.preventDefault();

    // Inject dropdown into parent menu-item (once only)
    const menuItem = b[0].closest ? b[0].closest('.menu-item') : b[0].parentElement;
    if (menuItem && !menuItem.querySelector('.user-dropdown')) {
      menuItem.classList.add('has-dropdown');
      const dropdown = document.createElement('ul');
      dropdown.className = 'user-dropdown';
      dropdown.innerHTML = `<li><a href="#" class="dropdown-logout">Log Out</a></li>`;
      menuItem.appendChild(dropdown);
      dropdown.querySelector('.dropdown-logout').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('SignOut').click();
      });
    }
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