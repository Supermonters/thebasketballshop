# Trang web này bán giày bóng rổ

## Chuẩn bị:
* Tải node.js
* Tải ngrok
## Để chạy:
### Bước 1: mở terminal và cd thư mục bạn đã giải nén ngrok
ví dụ: 
```batch
cd C:\Users\AD\Downloads\ngrok-v3-stable-windows-amd64
```
tiếp theo nhập:
```batch
.\ngrok config add-authtoken ::_INSERT KEY_(lấy key bằng cách tạo tài khoản ngrok và lấy mã ở phần Connect to your account)
```
tiếp theo nhập
```batch
.\ngrok http 8080
```
### Bước 2:
Vào vscode terminal
nhập
```batch
 npm install
 ```
và
```batch
 npm test
 ```
### Done trang web sẽ chạy ở link trong terminal
vd
```
Forwarding https://979d-42-112-192-150.ngrok-free.app -> http://localhost:8080
```
bấm vào link có đuôi ngrok-free.app để chạy
