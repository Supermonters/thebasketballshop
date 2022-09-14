
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem())
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged())
    }
      
    
   

   
}
function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}
function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal();
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
    document.getElementsByClassName('cart-total-price')[0].innerText =  total +".000 VNĐ"
}
function cartload() {
    for (var i = 0; i < localStorage.length; i++) {
        var value = localStorage.getItem(localStorage.key(i));
        if (value && value.startsWith('<div class = "cart-row" >')) {
        document.getElementById('chuaSanPham').innerHTML += value;
        }
     }
     
}
function addsp1() {
    if (localStorage.getItem('sp1') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp1 = `<div class = "cart-row" >
        <div class = "cart-item cart-column" >
             <img class = "cart-item-image" src = "dummy/cartPic/pg6ep.png"
             width = "100" height = "100" >
              <span class = "cart-item-title " >PG6 EP</span >
        </div>
        <span class = "cart-price cart-column" >3.329.000</span >
        <div class = "cart-quantity cart-column " >
              <input class = " cart-quantity-input "type = "number" value = "1" >
              <button class = " btn btn-danger" onclick="removeSp1()"
             type = "button"  >REMOVE</button >
        </div>
    </div>`
    localStorage.setItem('sp1',sp1);
    location.reload()
    }
    
}
function removeSp1(){
    localStorage.removeItem('sp1');
    location.reload()
}

