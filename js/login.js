

function signout(){
  localStorage.removeItem(localStorage.key('TaiKhoanDangNhap'));
  location.reload()
}
function register() {
 
  if (localStorage.getItem("DangNhap") == null ) {
    var a = localStorage.length+1
   }else{
    var a = localStorage.length
   }
  
   
    
    var taiKhoan ={
          'name': document.getElementById("username").value,
          'pass': document.getElementById("password").value
    }
    if (taiKhoan.name ==="" || taiKhoan.pass ==="") {
      alert("Vui lòng điền vào chỗ còn trống");
      return;
    }
    if (localStorage.length > 0) {
      for (let i = 0; i < localStorage.length; i++) {
        let taiKhoanTrenLocal =JSON.parse(localStorage.getItem(localStorage.key(i)));
        if (taiKhoan.name === taiKhoanTrenLocal.name) {
          alert('Tên đăng nhập đã tồn tại,vui lòng đặt 1 tên khác')
          return;
        }
        
      }
    }
    document.getElementById('cpassword').style.display = "inline-block";
    document.getElementById('cpassword').onkeypress = function(e){
      if (!e) e = window.event;
      if (e.keyCode == '13'){
        if (this.value == "") {
          alert("Vui lòng xác nhận mật khẩu");
        }else if (this.value !== taiKhoan.pass) {
          alert("Vui lòng kiểm tra lại mật khẩu xác nhận");
        }else if(this.value === taiKhoan.pass){
          const myJSON= JSON.stringify(taiKhoan);
        
          localStorage += localStorage.setItem("NguoiDungSo"+a,myJSON)
          alert('Đăng kí thành công');
          document.getElementById('cpassword').style.display = "none";
        }
          
        
      }
    }
    
    
    
  }
  
  function login(){
 
    var taiKhoanGhiVao ={
          'name':document.getElementById("username").value,
          'pass':document.getElementById("password").value
    }
  
    if (taiKhoanGhiVao.name ==="" || taiKhoanGhiVao.pass ==="") {
      alert("Vui lòng điền vào chỗ còn trống");
      return;
    }else if (localStorage.length ==0) {
      alert('Tên đăng nhập không tồn tại,vui lòng đăng kí');
    }else if(localStorage.length >= 0){
      for (let i = 0; i < localStorage.length;i++) {
        var nguoiDungNhapTuLocal =  JSON.parse(localStorage.getItem(localStorage.key(i)));
        
        if (nguoiDungNhapTuLocal.name === taiKhoanGhiVao.name) {
          if (nguoiDungNhapTuLocal.pass === taiKhoanGhiVao.pass) {
            alert('Đăng nhập thành công');
           localStorage.setItem('TaiKhoanDangNhap',taiKhoanGhiVao.name);
           load();

            break;
          }else{
            alert('Sai mật khẩu,vui lòng thử lại')
            break;
          }
      }else if (nguoiDungNhapTuLocal.name !== taiKhoanGhiVao.name) {
        if (i == localStorage.length-1 ) {
          alert('Tên đăng nhập không tồn tại,vui lòng đăng kí');
        }else{
          continue;
        }
        
      }
    }
  }
  }
 
  function load(){
   if (localStorage.getItem("TaiKhoanDangNhap") == null ) {
    return;
   }else{
    var a = localStorage.getItem('TaiKhoanDangNhap')
    document.getElementById('welcomeaido').innerHTML = `Welcome,`+ a;
    
   }

  //  if(localStorage.length > 0){
  //     var localStorageArray = new Array();
  //     for (i=0;i<localStorage.length;i++){
  //         localStorageArray[i] = localStorage.key(i)+localStorage.getItem(localStorage.key(i));
  //     }
  //  }
  //  var sortedArray = localStorageArray.sort();
  //  var tenNguoiDung= sortedArray[0].substring(1);
  //  document.getElementById('welcomeaido').innerHTML = `Welcome,`+ tenNguoiDung;
}