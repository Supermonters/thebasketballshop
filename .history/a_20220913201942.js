function addsp11() {
    if (localStorage.getItem('sp11') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp11 = ``
    localStorage.setItem('sp11',sp11);
    alert('Đã thêm món đồ vào giỏ hàng')
    }
    updateCartTotal()
}
function removesp11(){
    localStorage.removeItem('sp11');
    location.reload()
}
