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
function cartCounting() {
    var cartItemNumber = 0;
    for (let i = 1; i < 13; i++) {
        if (localStorage.getItem('sp'+i) !== null) {
            cartItemNumber++;
        }  
        
    }
    document.getElementById('cart-items').
    document.getElementById('countItem').innerHTML = "("+cartItemNumber+")";
    
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
     ready();
     updateCartTotal();
}
function purchase() {
    if (localStorage.getItem("sp1")==null &&
        localStorage.getItem("sp2")==null &&
        localStorage.getItem("sp3")==null &&
        localStorage.getItem("sp4")==null &&
        localStorage.getItem("sp5")==null &&
        localStorage.getItem("sp6")==null &&
        localStorage.getItem("sp7")==null &&
        localStorage.getItem("sp8")==null &&
        localStorage.getItem("sp9")==null &&
        localStorage.getItem("sp10")==null &&
        localStorage.getItem("sp11")==null &&
        localStorage.getItem("sp12")==null       
        
        ) {
            alert('Giỏ hàng hiện đang trống vui lòng chọn hàng để thanh toán')
            
        
    }else{
        alert('Cảm ơn vì đã mua hàng');
         
        for (let i = 1; i <= 12; i++) {
            localStorage.removeItem("sp"+i);
        
        }
        location.reload()
    }
    
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
    cartCounting();
    }
    
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
    cartCounting();
    }
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
    cartCounting();
    }
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

     <img class = "cart-item-image" src = "dummy/cartPic/AirJordanXXXVIPF_red.png"
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
    cartCounting();
    }
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
    cartCounting();
    }
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
<span class = "cart-price cart-column" >0.349.000</span >
<div class = "cart-quantity cart-column " >
      <input class = " cart-quantity-input "type = "number" value = "1" >
      <button class = " btn btn-danger" onclick="removeSp6()"
     type = "button" >REMOVE</button >
</div>
</div>`
    localStorage.setItem('sp6',sp6);
    alert('Đã thêm món đồ vào giỏ hàng')
    cartCounting();
    }
}
function removeSp6(){
    localStorage.removeItem('sp6');
    location.reload()
}
function addsp7() {
    if (localStorage.getItem('sp7') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp7 = `<div class = "cart-row" >
<div class = "cart-item cart-column" >

     <img class = "cart-item-image" src = "dummy/cartPic/LeBron19Low.png"
     width = "100" height = "100" >
      <span class = "cart-item-title " >LeBron 19 Low</span >
</div>
<span class = "cart-price cart-column" >4.699.000</span >
<div class = "cart-quantity cart-column " >
      <input class = " cart-quantity-input "type = "number" value = "1" >
      <button class = " btn btn-danger" onclick="removeSp7()"
     type = "button" >REMOVE</button >
</div>
</div>`
    localStorage.setItem('sp7',sp7);
    alert('Đã thêm món đồ vào giỏ hàng')
    cartCounting();
    }
}
function removeSp7(){
    localStorage.removeItem('sp7');
    location.reload()
}
function addsp8() {
    if (localStorage.getItem('sp8') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp8 = `<div class = "cart-row" >
<div class = "cart-item cart-column" >

     <img class = "cart-item-image" src = "dummy/cartPic/KT5 Veteran.png"
     width = "100" height = "100" >
      <span class = "cart-item-title " >KT5 "Veteran"</span >
</div>
<span class = "cart-price cart-column" >2.459.000</span >
<div class = "cart-quantity cart-column " >
      <input class = " cart-quantity-input "type = "number" value = "1" >
      <button class = " btn btn-danger" onclick="removeSp8()"
     type = "button" >REMOVE</button >
</div>
</div>`
    localStorage.setItem('sp8',sp8);
    alert('Đã thêm món đồ vào giỏ hàng')
    cartCounting();
    }
}
function removeSp8(){
    localStorage.removeItem('sp8');
    location.reload()
}
function addsp9() {
    if (localStorage.getItem('sp9') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp9 = `<div class = "cart-row" >
<div class = "cart-item cart-column" >

     <img class = "cart-item-image" src = "dummy/cartPic/Li Ning Way Of Wade 9 Infinity Balance.png"
     width = "100" height = "100" >
      <span class = "cart-item-title " >Li Ning Way Of Wade 9 Infinity</span >
</div>
<span class = "cart-price cart-column" >10.499.000</span >
<div class = "cart-quantity cart-column " >
      <input class = " cart-quantity-input "type = "number" value = "1" >
      <button class = " btn btn-danger" onclick="removeSp9()"
     type = "button" >REMOVE</button >
</div>
</div>`
    localStorage.setItem('sp9',sp9);
    alert('Đã thêm món đồ vào giỏ hàng')
    cartCounting();
    }
}
function removeSp9(){
    localStorage.removeItem('sp9');
    location.reload()
}
function addsp10() {
    if (localStorage.getItem('sp10') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp10 = `<div class = "cart-row" >
<div class = "cart-item cart-column" >

     <img class = "cart-item-image" src = "dummy/cartPic/PRO 2.0 OFFICIAL GAME BALL.png"
     width = "100" height = "100" >
      <span class = "cart-item-title " >PRO 2.0 OFFICIAL GAME BALL</span >
</div>
<span class = "cart-price cart-column" >2.249.000</span >
<div class = "cart-quantity cart-column " >
      <input class = " cart-quantity-input "type = "number" value = "1" >
      <button class = " btn btn-danger" onclick="removeSp10()"
     type = "button" >REMOVE</button >
</div>
</div>`
    localStorage.setItem('sp10',sp10);
    alert('Đã thêm món đồ vào giỏ hàng')
    cartCounting();
    }
}
function removeSp10(){
    localStorage.removeItem('sp10');
    location.reload()
}
function addsp11() {
    if (localStorage.getItem('sp11') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp11 = `<div class = "cart-row" >
<div class = "cart-item cart-column" >

     <img class = "cart-item-image" src = "dummy/cartPic/Under Amour HOVR™ Havoc 4 Clone.png"
     width = "100" height = "100" >
      <span class = "cart-item-title " >Under Amour Havoc 4 Clone</span >
</div>
<span class = "cart-price cart-column" >1.700.000</span >
<div class = "cart-quantity cart-column " >
      <input class = " cart-quantity-input "type = "number" value = "1" >
      <button class = " btn btn-danger" onclick="removeSp11()"
     type = "button" >REMOVE</button >
</div>
</div>`
    localStorage.setItem('sp11',sp11);
    alert('Đã thêm món đồ vào giỏ hàng')
    cartCounting();
    }
}
function removeSp11(){
    localStorage.removeItem('sp11');
    location.reload()
}
function addsp12() {
    if (localStorage.getItem('sp12') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp12 = `<div class = "cart-row" >
<div class = "cart-item cart-column" >

     <img class = "cart-item-image" src = "dummy/cartPic/Nike Hoops Elite Pro.png"
     width = "100" height = "100" >
      <span class = "cart-item-title " >Nike Hoops Elite Pro</span >
</div>
<span class = "cart-price cart-column" >2.089.000</span >
<div class = "cart-quantity cart-column " >
      <input class = " cart-quantity-input "type = "number" value = "1" >
      <button class = " btn btn-danger" onclick="removeSp12()"
     type = "button" >REMOVE</button >
</div>
</div>`
    localStorage.setItem('sp12',sp12);
    alert('Đã thêm món đồ vào giỏ hàng')
    cartCounting();
    }
}
function removeSp12(){
    localStorage.removeItem('sp12');
    location.reload()
}





