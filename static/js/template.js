(function () {
  async function postJson(url, payload) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let data = {};
    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  SignUp.addEventListener("click", async (e) => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;

    try {
      await postJson("/auth/signup", { username, email, password });
      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Tạo tài khoản thành công",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  });

  SignIn.addEventListener("click", async (e) => {
    if (localStorage.getItem("TaiKhoanDangNhap") !== null) {
      await Swal.fire({
        icon: "error",
        title: "Thất bại",
        text: "Bạn hiện đang đăng nhập",
      });
      return;
    }

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const result = await postJson("/auth/signin", { email, password });
      localStorage.setItem("TaiKhoanDangNhap", result.username);
      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đăng nhập thành công",
      });
      window.location.reload();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  });

  SignOut.addEventListener("click", async (e) => {
    if (localStorage.getItem("TaiKhoanDangNhap") == null) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Bạn hiện đang không đăng nhập",
      });
      return;
    }

    try {
      await postJson("/auth/signout", {});
      localStorage.removeItem("TaiKhoanDangNhap");
      location.reload();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  });
})();
