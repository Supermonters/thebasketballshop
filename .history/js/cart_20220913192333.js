if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    // var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    // for (var i = 0; i < removeCartItemButtons.length; i++) {
    //     var button = removeCartItemButtons[i]
    //     button.addEventListener('click', removeCartItem)
    // }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

   

   
}


// function removeCartItem(event) {
//     var buttonClicked = event.target
//     buttonClicked.parentElement.parentElement.remove()
//     updateCartTotal()
// }

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}



function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('.', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = (total.toFixed(3))/1000
    if (total == 0) {
        document.getElementsByClassName('cart-total-price')[0].innerText = "0 VNĐ"
    }else{
        document.getElementsByClassName('cart-total-price')[0].innerText =  total +".000 VNĐ"

    }
}
function cartload() {
    for (var i = 0; i < localStorage.length; i++) {
        var value = localStorage.getItem(localStorage.key(i));
        if (value && value.startsWith('<div class = "cart-row" >')) {
        document.getElementById('chuaItem').innerHTML += value;
        }
     }
     ready()
     updateCartTotal()
}
function addsp1() {
    if (localStorage.getItem('sp1') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp1 = `<div class = "cart-row" >
<div class = "cart-item cart-column" >
     <img class = "cart-item-image" src = "dummy/cartPic/kd14square.png"
     width = "100" height = "100" >
      <span class = "cart-item-title " >KD14 EP</span >
</div>
<span class = "cart-price cart-column" >3.527.000</span >
<div class = "cart-quantity cart-column " >
      <input class = " cart-quantity-input "type = "number" value = "1" >
      <button class = " btn btn-danger" type = "button" onclick="removeSp1()" >REMOVE</button >
</div>
</div> 
</div>`
    localStorage.setItem('sp1',sp1);
    alert('Đã thêm món đồ vào giỏ hàng')
    }
    updateCartTotal()
}
function removeSp1(){
    localStorage.removeItem('sp1');
    location.reload()
}
function addsp2() {
    if (localStorage.getItem('sp2') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp2 = `<div class = "cart-row" >
<div class = "cart-item cart-column" >
     <img class = "cart-item-image" src = "dummy/cartPic/pg6ep.png"
     width = "100" height = "100" >
      <span class = "cart-item-title " >PG6 EP</span >
</div>
<span class = "cart-price cart-column" >3.329.000</span >
<div class = "cart-quantity cart-column " >
      <input class = " cart-quantity-input "type = "number" value = "1" >
      <button class = " btn btn-danger"
     type = "button" onclick="removeSp2()" >REMOVE</button >
</div>
</div>`
    localStorage.setItem('sp2',sp2);
    alert('Đã thêm món đồ vào giỏ hàng')
    }
    updateCartTotal()
}
function removeSp2(){
    localStorage.removeItem('sp2');
    location.reload()
}
function addsp3() {
    if (localStorage.getItem('sp3') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp3 = `<div class = "cart-row" >
<div class = "cart-item cart-column" >

     <img class = "cart-item-image" src = "dummy/cartPic/bucksjersey.png"
     width = "100" height = "100" >
      <span class = "cart-item-title " >Milwaukee Bucks Jersey</span >
</div>
<span class = "cart-price cart-column" >2.959.000</span >
<div class = "cart-quantity cart-column " >
      <input class = " cart-quantity-input "type = "number" value = "1" >
      <button class = " btn btn-danger" onclick="removeSp3()"
     type = "button" >REMOVE</button >
</div>
</div>`
    localStorage.setItem('sp3',sp3);
    alert('Đã thêm món đồ vào giỏ hàng')
    }
    updateCartTotal()
}
function removeSp3(){
    localStorage.removeItem('sp3');
    location.reload()
}
function addsp4() {
    if (localStorage.getItem('sp4') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp4 = `<div class = "cart-row" >
<div class = "cart-item cart-column" >

     <img class = "cart-item-image" src = "dummy/cartPic/AirJordanXXXVIPF.png"
     width = "100" height = "100" >
      <span class = "cart-item-title " >Air Jordan XXXVI PF</span >
</div>
<span class = "cart-price cart-column" >5.439.000</span >
<div class = "cart-quantity cart-column " >
      <input class = " cart-quantity-input "type = "number" value = "1" >
      <button class = " btn btn-danger" onclick="removeSp4()"
     type = "button" >REMOVE</button >
</div>
</div>`
    localStorage.setItem('sp4',sp4);
    alert('Đã thêm món đồ vào giỏ hàng')
    }
    updateCartTotal()
}
function removeSp4(){
    localStorage.removeItem('sp4');
    location.reload()
}
function addsp5() {
    if (localStorage.getItem('sp5') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp5 = `<div class = "cart-row" >
<div class = "cart-item cart-column" >
     <img class = "cart-item-image" src = "dummy/cartPic/Harden.png"
     width = "100" height = "100" >
      <span class = "cart-item-title " >Harden Stepback 2 Core Black</span >
</div>
<span class = "cart-price cart-column" >3.599.000</span >
<div class = "cart-quantity cart-column " >
      <input class = " cart-quantity-input "type = "number" value = "1" >
      <button class = " btn btn-danger" onclick="removeSp5()"
     type = "button" >REMOVE</button >
</div>
</div>`
    localStorage.setItem('sp5',sp5);
    alert('Đã thêm món đồ vào giỏ hàng')
    }
    updateCartTotal()
}
function removeSp5(){
    localStorage.removeItem('sp5');
    location.reload()
}
function addsp6() {
    if (localStorage.getItem('sp6') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp6 = `<div class = "cart-row" >
<div class = "cart-item cart-column" >
     <img class = "cart-item-image" src = "dummy/cartPic/adidas_sock_white.png"
     width = "100" height = "100" >
      <span class = "cart-item-title " >Bộ 3 đôi tất cao cổ (Trắng)</span >
</div>
<span class = "cart-price cart-column" >350</span ><span class = "cart-price cart-column">.000</span>
<div class = "cart-quantity cart-column " >
      <input class = " cart-quantity-input "type = "number" value = "1" >
      <button class = " btn btn-danger" onclick="removeSp6()"
     type = "button" >REMOVE</button >
</div>
</div>`
    localStorage.setItem('sp6',sp6);
    alert('Đã thêm món đồ vào giỏ hàng')
    }
    updateCartTotal()
}
function removeSp6(){
    localStorage.removeItem('sp6');
    location.reload()
}


