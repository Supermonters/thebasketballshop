function addsp12() {
    if (localStorage.getItem('sp12') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp12 = ``
    localStorage.setItem('sp12',sp12);
    alert('Đã thêm món đồ vào giỏ hàng')
    }
    updateCartTotal()
}
function removesp12(){
    localStorage.removeItem('sp12');
    location.reload()
}
