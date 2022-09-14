function addsp10() {
    if (localStorage.getItem('sp10') !== null) {
        alert('Bạn đã chọn sản phẩm này rồi')
    }else{
var sp10 = ``
    localStorage.setItem('sp10',sp10);
    alert('Đã thêm món đồ vào giỏ hàng')
    }
    updateCartTotal()
}
function removesp10(){
    localStorage.removeItem('sp10');
    location.reload()
}
