function addsp9() {
    if (localStorage.getItem('sp9') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp9 = ``
    localStorage.setItem('sp9',sp9);
    alert('Đã thêm món đồ vào giỏ hàng')
    }
    updateCartTotal()
}
function removeSp9(){
    localStorage.removeItem('sp9');
    location.reload()
}
