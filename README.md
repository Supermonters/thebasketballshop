# The Basketballshop

## REQUIRMENTS:
* íntall node.js
* install ngrok
## Để chạy:
### Step 1: Open terminal và cd to the folder that you extracted ngrok
Example: 
```batch
cd C:\Users\AD\Downloads\ngrok-v3-stable-windows-amd64
```
Next, type to terminal:
```batch
.\ngrok config add-authtoken ::_INSERT KEY_(lấy key bằng cách tạo tài khoản ngrok và lấy mã ở phần Connect to your account)
```
Next, set the port:
```batch
.\ngrok http 8080
```
### Step 2:
Open VScode, go to the Terminal
Type:
```batch
 npm install
 ```
and then
```batch
 npm test
 ```
### Done, now the basketball website can be access at the servel in Terminal
vd
```
Forwarding https://979d-42-112-192-150.ngrok-free.app -> http://localhost:8080
```
Please follow the provided hyperlink, which concludes with "ngrok-free.app" in order to gain access to the website.
