function addsp8() {
    if (localStorage.getItem('sp8') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp8 = `<div class = "cart-row" >
<div class = "cart-item cart-column" >
     <img class = "cart-item-image" src = "dummy/cartPic/kd14square.png"
     width = "100" height = "100" >
      <span class = "cart-item-title " >KD14 EP</span >
</div>
<span class = "cart-price cart-column" >3.527.000</span >
<div class = "cart-quantity cart-column " >
      <input class = " cart-quantity-input "type = "number" value = "1" >
      <button class = " btn btn-danger" type = "button" onclick="removesp8()" >REMOVE</button >
</div>
</div> 
</div>`
    localStorage.setItem('sp8',sp8);
    alert('Đã thêm món đồ vào giỏ hàng')
    }
    updateCartTotal()
}
function removesp8(){
    localStorage.removeItem('sp8');
    location.reload()
}