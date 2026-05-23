(async () => {
    const authCheck = await fetch("/admin/checkauth");
    if (!authCheck.ok) {
        location.href = "/admin/login.html";
        return;
    }

    let subele = document.getElementById("submit"),
        signoutele = document.getElementById("signout");

    subele.addEventListener("click", async () => {
        const proname = document.getElementById("proname").value,
            alt = document.getElementById("alt").value,
            banner = document.getElementById("banner").value,
            price = document.getElementById("price").value,
            filter = document.getElementById("filter").value,
            mouseoverpic = document.getElementById("mouseoverpic").value,
            mouseoutpic = document.getElementById("mouseoutpic").value,
            cartpic = document.getElementById("cartpic").value,
            picsels = document.getElementsByClassName("images"),
            opsels = document.getElementsByClassName("options");
        let pics = [];
        let ops = [];
        for (let i = 0; i < picsels.length; i++) {
            pics.push(picsels[i].value);
        }
        for (let i = 0; i < opsels.length; i++) {
            ops.push(opsels[i].value);
        }
        let f = await fetch("/admin/addproduct", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: proname,
                alt, banner, price, filter,
                mouseover: mouseoverpic,
                mouseout: mouseoutpic,
                cartpic,
                images: pics,
                options: ops,
            }),
        });
        if (f.ok) {
            await Swal.fire({
                icon: "success",
                title: "Added Successfully!",
                showConfirmButton: false,
                timer: 1500,
            });
            location.reload();
        } else {
            await Swal.fire({
                icon: "error",
                title: "Failed to add product",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });

    signoutele.addEventListener("click", async () => {
        await fetch("/admin/logout", { method: "POST" });
        location.href = "/admin/login.html";
    });
})();
