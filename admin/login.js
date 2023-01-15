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
        location.href = "/admin/product.html";
    } else {
        localStorage.removeItem("adminCreds");
        // handle error
    }
})