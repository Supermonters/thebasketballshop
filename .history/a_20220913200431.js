function addsp8() {
    if (localStorage.getItem('sp8') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp8 = ``
    localStorage.setItem('sp8',sp8);
    alert('Đã thêm món đồ vào giỏ hàng')
    }
    updateCartTotal()
}
function removesp8(){
    localStorage.removeItem('sp8');
    location.reload()
}
