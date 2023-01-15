const loginele = document.getElementById("login");

loginele.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const eles = loginele.elements;
    const username = eles[0].value, password = eles[1].value;
    let f = await fetch(`/admin/checklogin?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
    if (f.ok) {
        localStorage.setItem("adminCreds", JSON.stringify({
            username: username,
            password: password
        }))
        await Swal.fire({
            icon: "success",
            title: `Welcome ${username} Boss`,
            showConfirmButton: false,
            timer: 1500,
        });
        location.href = "/admin/product.html";
    } else {
        localStorage.removeItem("adminCreds");
        await Swal.fire({
            icon: "error",
            title: "go away touch some grass dude ur impersonating my Boss",
            showConfirmButton: false,
            timer: 1500,
        });
    }
})