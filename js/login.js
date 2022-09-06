
function register() {
    let a = localStorage.length+1
    
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
      const myJSON= JSON.stringify(taiKhoan);
    
    localStorage += localStorage.setItem('nguoiDungSo'+a,myJSON)
    alert('Đăng kí thành công');
    
    
    
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
           
             var a = document.getElementById('welcomeaido').innerHTML = `Welcome,` +taiKhoanGhiVao.name
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
  