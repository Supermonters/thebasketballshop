const loginele = document.getElementById("login");

loginele.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const eles = loginele.elements;
    const username = eles[0].value, password = eles[1].value;
    let f = await fetch("/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    if (f.ok) {
        await Swal.fire({
            icon: "success",
            title: `Welcome ${username} Boss`,
            showConfirmButton: false,
            timer: 1500,
        });
        location.href = "/admin/product.html";
    } else {
        await Swal.fire({
            icon: "error",
            title: "Invalid credentials",
            showConfirmButton: false,
            timer: 1500,
        });
    }
});
