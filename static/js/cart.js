if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
async function themVaoGioThanhCong() {
  await Swal.fire({
    icon: "success",
    title: "Đã thêm vào giỏ hàng",
    showConfirmButton: false,
    timer: 1500,
  });
}
async function daCoTrongRo() {
  await Swal.fire({
    icon: "warning",
    title: "Bạn đã chọn sản phẩm này rồi",
    showConfirmButton: false,
    timer: 1500,
  });
}
function ready() {
  var quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }
}

function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName("cart-items")[0];
  var cartRows = cartItemContainer.getElementsByClassName("cart-row");
  var total = 0;
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName("cart-price")[0];
    var quantityElement = cartRow.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    var price = parseFloat(priceElement.innerText.replace(".", ""));
    var quantity = quantityElement.value;
    total = total + price * quantity;
  }
  let trips = "";
  while (total != 0) {
    trips = ("00" + total % 1000).slice(-3) + "." + trips;
    total -= total % 1000;
    total /= 1000;
  }
  if (trips != "") {
    trips += "000";
    while (trips.charAt(0) === '0') trips = trips.substring(1);
  }
  else trips = "0";
  document.getElementsByClassName("cart-total-price")[0].innerText =
    trips + " VNĐ";
}
function cartload() {
  for (var i = 0; i < localStorage.length; i++) {
    var value = localStorage.getItem(localStorage.key(i));
    if (value && value.startsWith('<div class = "cart-row" >')) {
      document.getElementById("chuaItem").innerHTML += value;
    }
  }
  ready();
  updateCartTotal();
}

async function checkfornopurchases() {
  if (pdc === undefined) await getpdc();
  for (let i = 1; i <= pdc; i++) {
    if (localStorage.getItem(`sp${i}`) != null) return false;
  }
  return true;
}

async function purchase() {
  if ((await checkfornopurchases())) {
    Swal.fire("Giỏ hàng hiện trống vui lòng thêm đồ để thanh toán", "", "warning");
  } else {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: true,
    });

    let result = await swalWithBootstrapButtons.fire({
      title: "Bạn chắc chắn muốn mua hàng không?",
      text: "Việc này sẽ không thể hoàn tác",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      await swalWithBootstrapButtons.fire(
        "Xác nhận",
        "Cảm ơn bạn đã mua hàng",
        "success"
      );
      if (pdc === undefined) await getpdc();
      for (let i = 1; i <= pdc; i++) {
        localStorage.removeItem("sp" + i);
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      await swalWithBootstrapButtons.fire("Đã huỷ", "Huỷ thành công", "error");
    }
    location.reload();
  }
}
async function removeAll() {
  if ((await checkfornopurchases())) {
    Swal.fire("Giỏ hàng hiện trống", "", "warning");
  } else {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: true,
    });

    let result = await swalWithBootstrapButtons.fire({
      title: "Bạn chắc chắn làm trống giỏ hàng không?",
      text: "Việc này sẽ không thể hoàn tác",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      await swalWithBootstrapButtons.fire(
        "Xác nhận",
        "Đã xóa giỏ hàng",
        "success"
      );
      if (pdc === undefined) await getpdc();
      for (let i = 1; i <= pdc; i++) {
        localStorage.removeItem("sp" + i);
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      await swalWithBootstrapButtons.fire("Đã huỷ", "Huỷ thành công", "error");
    }
    location.reload();
  }
}

async function addsp(pic, name, option, price, id) {
  if (localStorage.getItem("sp" + id) !== null) {
    await daCoTrongRo();
  } else {
    var sp = `<div class = "cart-row" >
<div class = "cart-item cart-column" >
      <img class = "cart-item-image" src = "${pic}"
      width = "100" height = "100" >
      <span class = "cart-item-title " >${name}<br>${option}</span >
</div>
<span class = "cart-price cart-column" >${price}</span >
<div class = "cart-quantity cart-column " >
      <input class = " cart-quantity-input "type = "number" value = "1" >
      <button style="font-weight:700;background-color:red;border-radius:3px;box-shadow:rgb(45 35 66 / 40%) 0 2px 4px, rgb(45 35 66 / 30%) 0 7px 13px -3px, red 0 -3px 0 inset" class = " btn btn-danger1" type = "button" onclick="removeSp(${id})" >REMOVE</button >
</div>
</div> 
</div>`;
    localStorage.setItem("sp" + id, sp);
    await themVaoGioThanhCong();
    cartCounting();
  }
}

function removeSp(id) {
  localStorage.removeItem("sp" + id);
  location.reload();
}

async function nothing() {
  if (!(await checkfornopurchases()))
    document.getElementById('nothingInTheCart').style = "display:none"
}