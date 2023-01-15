if (localStorage.getItem("adminCreds") === null) location.href = "/admin/login.html";

let prodele = document.getElementById("prod");

prodele.addEventListener("submit", () => {
    let elems = prodele.elements;
    for (let i = 0; i < elems.length; i++) {
        console.log(prodele[i]);
    }
})