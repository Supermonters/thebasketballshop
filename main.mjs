import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import fetch from "node-fetch";
import nodemailer from "nodemailer";
import fileUpload from "express-fileupload";
import configs from "./config.json" assert { type: "json" };

const db = new Low(new JSONFile("db/db.json"));
const app = express();
app.use(fileUpload());

let transporter = nodemailer.createTransport({
  host: "smtp.elasticemail.com",
  port: 2525,
  secure: false, // true for 465, false for other ports
  auth: {
    user: configs.MAILUSER, // generated ethereal user
    pass: configs.MAILPASSWORD, // generated ethereal password
  },
});
await db.read();

function findbyproductname(products, name) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].name === name) return products[i];
  }
  return {};
}

function checkifadminexists(username, password) {
    for (let [key, value] of Object.entries(db.data.admins)) {
        if (key === username && value === password) return true;
    }
    return false;
}

db.data ||= {
  products: [],
};

app.use("/", express.static("static"));
app.use("/admin", express.static("admin"));

app.get("/news", async (req, res) => {
  let arr;
  let d = new Date();
  d.setTime(Date.now());
  if (
    db.data.news === undefined ||
    db.data.news.date !==
      `${d.getUTCHours().toString()}${d.getUTCDate().toString()}${d
        .getUTCMonth()
        .toString()}${d.getUTCFullYear().toString()}`
  ) {
    let a = await fetch(
      "https://newsdata.io/api/1/news?apikey=pub_1550576968a334f90cbb606bd4690ca338b1e&q=nba&language=en&category=sports"
    );
    let data = await a.json();
    arr = data.results.filter(
      (el) => el.image_url !== null && el.description !== null
    );
    db.data.news = {
      date: `${d.getUTCHours().toString()}${d.getUTCDate().toString()}${d
        .getUTCMonth()
        .toString()}${d.getUTCFullYear().toString()}`,
      arr: arr,
    };
    await db.write();
  } else {
    arr = db.data.news.arr;
  }
  res.status(200).json({
    news: arr,
  });
});

app.get("/productlist", async (req, res) => {
  res.status(200).json(db.data);
});

app.get("/pdcnt", async (req, res) => {
  res.status(200).json({
    count: db.data.products.length,
  });
});

app.get("/mail", async (req, res) => {
  const address = req.query.mail;
  await transporter.sendMail({
    from: `"BasketballShop" <${configs.MAILUSER}>`, // sender address
    to: address, // list of receivers
    subject: "Newsletter", // Subject line
    text: "Cảm ơn bạn đã đăng kí newsletter của BasketballShop.\nChúng tôi sẽ gửi cho bạn các thông tin về NBA.", // plain text body
    html: `Cảm ơn bạn đã đăng kí newsletter của BasketballShop.<br>Chúng tôi sẽ gửi cho bạn các thông tin về NBA.<br>Đây là tin nhắn tự động, xin đừng trả lời tin nhắn này.<br><img src="https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/304881059_107600002091807_5624213785648279587_n.png?_nc_cat=108&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=g35yFBvN5ZwAX8ufcDE&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfBC--swpZWsUuHSWclaxQ99wqqSeY0Dp2M6uL4JXXIXrA&oe=63C701EF" alt="idk" width=200 height=200>
        `, // html body
  });
});

app.get("/admin/checklogin", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    if (checkifadminexists(username, password)) {
        res.status(200).send("admin exists");
    } else {
        res.status(400).send("admin doesnt exist");
    }
})

app.get("/admin/addproduct", (req, res) => {

})

app.get("/store_item", async (req, res) => {
  const itemName = req.query.item;
  const item = findbyproductname(db.data.products, itemName);
  let html = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${item.name}</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Chonburi&display=swap" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Fira+Sans+Extra+Condensed:wght@700&display=swap"
                rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Martel:wght@300&display=swap" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&display=swap" rel="stylesheet">
            <link rel="icon" type="image/x-icon" href="/images/favicon.png">
            <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            <style>
            html {
                background-color: #f2f2f2;
                }
                
                body {
                margin: 0;
                font-size: 28px;
                font-family: Arial, Helvetica, sans-serif;
                }
                
                .header {
                background-color: #f1f1f1;
                padding: 30px;
                text-align: center;
                
                }
                
                p {
                font-family: 'Martel', serif;
                }
                @media (max-width: 1024px) {
        .pro-info {
            padding-top: 0 !important;
        }
        
        .pc_toolbar_top.active {
            display: flex !important;
        }
        
        .pc_toolbar_top.add-cart-buttons.btn-add-cart {
        
            width: 100%;
            height: 44px;
            background: #005ec4;
            border: none;
            font-weight: 700;
            font-size: 16px;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            text-transform: uppercase;
        }
        
        .pc_toolbar_top.add-cart-buttons {
            display: flex;
            flex-direction: column-reverse;
            justify-content: space-between;
            margin-top: 12px;
        }
        
        .pc_toolbar_top .add-cart-buttons .btn-add-cart {
        
            border: 1px solid #005ec4 !important;
            margin-top: 10px;
        }
        
        .pc_toolbar_top .add-cart-buttons .btn-add-cart {
            width: 100%;
            height: 44px;
            background: #005ec4;
            border: none;
            font-weight: 700;
            font-size: 16px;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            text-transform: uppercase;
        }
        
        .price {
            display: none;
        }
        .price-number1 {
            display: block !important;
            font-weight: 700 !important;
            font-size: 24px !important;
            color: #f9495f !important;
            margin-bottom: 16px !important;
        }
        
        .pc_toolbar_top .product-name {
            font-weight: 600;
            font-size: 14px;
            line-height: 21px;
            color: #005ec4;
            margin-bottom: 12px;
            margin-left: 0 !important;
        }
        
        .pc_toolbar_top .price {
            font-weight: 700;
            font-size: 24px;
            color: #f9495f;
            margin-bottom: 16px;
        }
        
        .hide-pc {
            display: flex;
        }
        
        .pc_toolbar_top.active {
            display: none;
            width: calc(100% - 32px);
            background: #fff;
            box-shadow: 0 -2px 10px rgb(0 0 0 / 16%);
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 99;
            flex-direction: column;
            padding: 12px 16px;
        }
        #optionThing{
            border: 3px solid black;
            border-radius: 2px;
            font-family: Chakra Petch;
            font-size:1.23rem;
        }
        
        }
        
        @media (min-width: 1024px) {
        .sticky {
            position: fixed;
            bottom: 0;
            width: 100%;
            background-color: white;
            display: block;
        }
        
        .sticky+.content {
            padding-top: 60px;
            display: block;
        }
        
        #kd14banner {
            height: 100%;
            width: 100%;
        }
        
        .tab-content {
            padding: 0 20vw 0 20vw;
        }
        
        p {
            font-size: 1rem;
        }
        
        body::-webkit-scrollbar {
            background-color: #f1f1f1;
            width: 16px;
        }
        
        /* background of the scrollbar except button or resizer */
        body::-webkit-scrollbar-track {
            background-color: #f1f1f1;
        }
        
        /* scrollbar itself */
        body::-webkit-scrollbar-thumb {
            background-color: #babac0;
            border-radius: 16px;
            border: 4px solid #f1f1f1;
        }
        
        /* set button(top and bottom of the scrollbar) */
        body::-webkit-scrollbar-button {
            display: none;
        }
        
        img {
            width: 100%;
            height: 100%;
        
        }
        
        .product-single .product-detail-top {
            flex-direction: column;
        }
        
        .product-single .product-detail-top {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
        }
        
        
        .container-thing {
            width: 1110px;
            margin: auto;
            display: flex;
            justify-content: space-between;
        }
        
        
        .pc_toolbar_top .pro-info {
            display: flex;
            justify-content: space-between;
        
        }
        
        
        .pc_toolbar_top .actions {
            display: flex;
            font-weight: 600;
            font-size: 18px;
            color: #29324e;
        }
        
        
        .pc_toolbar_top .pro-info .product-name {
            font-weight: 700;
            font-size: 16px;
            line-height: 24px;
            display: flex;
            align-items: center;
            color: #005ec4;
        
            padding-right: 20px;
        }
        
        
        
        .pc_toolbar_top .pro-info .addcart-price {
            display: flex;
            align-items: center;
        }
        
        
        
        
        .pc_toolbar_top .pro-info .addcart-price .price {
            font-size: 16px;
        }
        
        
        .pc_toolbar_top .add-cart-buttons {
            flex-direction: row-reverse;
        }
        
        .product-single .add-cart-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 12px;
        }
        
        
        .pc_toolbar_top .add-cart-buttons .btn-add-cart.btn-add-cart-2 {
            margin-left: 8px;
        }
        
        .pc_toolbar_top .add-cart-buttons .btn-add-cart {
            width: 175px !important;
        }
        
        .product-single .add-cart-buttons .btn-add-cart-2 {
            background: #fff !important;
            border: 1px solid #005ec4 !important;
            color: #005ec4 !important;
        }
        
        .product-single .add-cart-buttons .btn-add-cart {
            width: calc(50% - 15px);
            height: 44px;
            background: #005ec4;
            border: none;
            font-weight: 700;
            font-size: 16px;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            text-transform: uppercase;
        }
        
        button,
        html input[type=button],
        input[type=reset],
        input[type=submit] {
            appearance: button;
            cursor: pointer;
            *overflow: visible;
        }
        
        button,
        select {
            text-transform: none;
        }
        
        button,
        input {
            line-height: normal;
        }
        
        button,
        input,
        select,
        textarea {
            font-size: 100%;
            margin: 0;
            vertical-align: baseline;
            *vertical-align: middle;
        }
        
        
        
        .pc_toolbar_top .pro-info .addcart-price button {
            width: 255px;
            height: 44px;
            background: #005ec4;
            border: none;
            font-weight: 700;
            font-size: 16px;
            color: #fff;
            margin-left: 1em;
            text-transform: uppercase;
        }
        
        .pc_toolbar_top .add-cart-buttons .btn-add-cart {
            width: 175px !important;
        }
        
        .product-single .add-cart-buttons .btn-add-cart {
            width: calc(50% - 15px);
            height: 44px;
            background: #005ec4;
            border: none;
            font-weight: 700;
            font-size: 16px;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            text-transform: uppercase;
        }
        
        button,
        html input[type=button],
        input[type=reset],
        input[type=submit] {
            appearance: button;
            cursor: pointer;
            *overflow: visible;
        }
        
        button,
        select {
            text-transform: none;
        }
        
        button,
        input {
            line-height: normal;
        }
        
        button,
        input,
        select,
        textarea {
            font-size: 100%;
            margin: 0;
            vertical-align: baseline;
            *vertical-align: middle;
        }
        
        .pc_toolbar_top .actions {
            display: flex;
            font-weight: 600;
            font-size: 18px;
            color: #29324e;
        }
        
        
        .pc_toolbar_top .actions div.tab.active,
        .pc_toolbar_top .actions div.tab:hover {
            border-color: #005ec4;
        }
        
        .pc_toolbar_top .actions div.tab {
            min-width: 130px;
            margin-right: 40px;
        }
        
        .pc_toolbar_top .actions div {
            border-bottom: 3px solid transparent;
            cursor: pointer;
            padding-bottom: 5px;
            text-align: center;
        }
        
        
        
        .pc_toolbar_top .actions {
            display: flex;
            font-weight: 600;
            font-size: 18px;
            color: #29324e;
        }
        
        .pc_toolbar_top .actions div.tab {
            min-width: 130px;
            margin-right: 40px;
        }
        
        .pc_toolbar_top .actions div {
            border-bottom: 3px solid transparent;
            cursor: pointer;
            padding-bottom: 5px;
            text-align: center;
        }
        
        
        
        .pc_toolbar_top .actions {
            display: flex;
            font-weight: 600;
            font-size: 18px;
            color: #29324e;
        }
        
        .pc_toolbar_top .actions div.tab {
            min-width: 130px;
            margin-right: 40px;
        }
        
        .pc_toolbar_top .actions div {
            border-bottom: 3px solid transparent;
            cursor: pointer;
            padding-bottom: 5px;
            text-align: center;
        }
        
        .product-single .add-cart-buttons .btn-add-cart-2 {
            background: #fff !important;
            border: 1px solid #005ec4 !important;
            color: #005ec4 !important;
        }
        
        
        
        .pc_toolbar_top .actions {
            display: flex;
            font-weight: 600;
            font-size: 18px;
            color: #29324e;
        }
        
        .pc_toolbar_top .actions div.go-top {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            color: #005ec4;
        }
        
        .pc_toolbar_top .actions div {
            border-bottom: 3px solid transparent;
            cursor: pointer;
            padding-bottom: 5px;
            text-align: center;
        }
        
        
        
        .pc_toolbar_top .actions {
            display: flex;
            font-weight: 600;
            font-size: 18px;
            color: #29324e;
        }
        
        .pc_toolbar_top .actions div.go-top i {
            margin-right: 15px;
            font-size: 20px;
        }
        
        .fa,
        .fab,
        .fad,
        .fal,
        .far,
        .fas {
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            display: inline-block;
            font-style: normal;
            font-feature-settings: normal;
            font-variant: normal;
            text-rendering: auto;
            line-height: 1;
        }
        
        .far {
            font-weight: 400;
        }
        
        .fal,
        .far {
            font-family: "Font Awesome 5 Pro";
        }
        
        .fa,
        .fab,
        .fad,
        .fal,
        .far,
        .fas {
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            display: inline-block;
            font-style: normal;
            font-variant: normal;
            text-rendering: auto;
            line-height: 1;
        }
        
        i {
            font-style: italic;
        }
        
        
        i {
            font-style: italic;
        }
        
        .pc_toolbar_top .actions div.go-top {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            color: #005ec4;
        }
        
        .pc_toolbar_top .actions div {
            border-bottom: 3px solid transparent;
            cursor: pointer;
            padding-bottom: 5px;
            text-align: center;
        }
        
        .pc_toolbar_top .actions {
            display: flex;
            font-weight: 600;
            font-size: 18px;
            color: #29324e;
        }
        
        
        
        
        
        
        .fa-angle-up:before {
            content: "\f106";
        }
        
        .fa-angle-up:before {
            content: "\f106";
        }
        
        .pc_toolbar_top.active {
            display: block;
        }
        
        svg:not(:root) {
            overflow: hidden;
        }
        
        #a::selection {
            background: #b3d4fc;
            text-shadow: none;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #f1f1f1;
            border-radius: 10px;
        }
        
        .product-single .add-cart-buttons .btn-add-cart svg {
            margin-right: 110px;
        }
        
        .product-single .add-cart-buttons .btn-add-cart-2:hover {
            color: #fa9f2c !important;
            background-color: #fff !important;
            border: 1px solid #fa9f2c !important;
        }
        #optionThing{
            border: 3px solid black;
            border-radius: 2px;
            font-family: Chakra Petch;
        }
        
        }
            </style>
        </head>
        
        <body>
            <div id="fb-root"></div>
            <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v15.0"
                nonce="gqHEQHLO"></script>
        
            <div class="header">
                <img style="padding-bottom: 10vw;" id="kd14banner" src="${item.banner}" alt="kd14"
                    height="100%" width="100%" style="margin: 0;">
            </div>
        
            <div class="tab-content" bis_skin_checked="1">
                <div class="tab-pane active" id="tabContent" bis_skin_checked="1">
                    <p style="text-align:justify;">
                    <h1 style="text-align: center;padding-bottom: 10vw;font-family: 'Chonburi', cursive;font-size: 3em; ">${item.name}
                    </h1><span style="font-size:20px;"></span></p>`;
  for (let i = 0; i < item.images.length; i++) {
    html += `<p style="text-align:center;"><img style="height: 80%;width: 80%;" alt="${item.alt}"
                src="${item.images[i]}">
        </p>
        <p style="text-align:center;"><span style="font-family:arial, helvetica, sans-serif;font-size:20px;">${item.alt}</span></p>`;
  }
  html += `</div>
            </div>
        
            <div style="display: flex;justify-content: center;margin-bottom: 12rem;"  class="fb-comments" data-href="https://basketballshop.netlify.app/store_item/pg6ep" data-width=""
                data-numposts="5"></div>
            <div class="pc_toolbar_top active" bis_skin_checked="1">
                <div class="container" style="padding-top: 1rem;" id="navbar" bis_skin_checked="1">
                    <div class="pro-info" bis_skin_checked="1" style="padding-top: 15px;">
                        <div class="product-name" bis_skin_checked="1"
                            style="margin-left: 15px;font-size: 1em;font-family: Chakra Petch;">${item.name}
                            <select id="optionThing" style="margin-left:5px;">`;
  for (let i = 0; i < item.options.length; i++) {
    html += `<option value=${item.options[i]}>${item.options[i]}</option>`;
  }
  html += `</select></div>
                        <div class="addcart-price" bis_skin_checked="1">
                            <div class="price" bis_skin_checked="1" style=" margin-right: 1rem;">Tổng chi phí<div
                                    bis_skin_checked="1"
                                    style="font-weight: 700;font-size: 20px;line-height: 30px;color: #f9495f;white-space: nowrap;font-family: Chakra Petch;">
                                    ${item.price}</div>
                            </div>
                            <div class="price-number1"
                                    bis_skin_checked="1"
                                    style="font-weight: 700;font-size: 20px;line-height: 30px;color: #f9495f;white-space: nowrap;font-family: Chakra Petch;display: none;">
                                    ${item.price}</div>
                            <div style="text-align: center;" class="add-cart-buttons" bis_skin_checked="1">
                                <button onclick='addsp("${item.cartpic}", "${item.name}", document.getElementById("optionThing").value, "${item.price}", ${item.id})' type="button"
                                    data-loading-text="Đang tải..." class="btn-add-cart btn-add-cart-2">
                                    <svg style="vertical-align: text-bottom;padding-right: 5px;" width="17" height="18"
                                        viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15.9187 9.83092L15.9187 8.16922L9.33085 8.16922L9.33085 1.58134H7.66915L7.66915 8.16922L1.08127 8.16922L1.08127 9.83092L7.66915 9.83092L7.66915 16.4188H9.33085L9.33085 9.83092L15.9187 9.83092Z"
                                            fill="white"></path>
                                    </svg>
                                    Mua Hàng
                                </button>
                                <a style="text-decoration: none;" href="/cart.html"> <button type="button"
                                        data-loading-text="Đang tải..." class="btn-add-cart btn- "
                                        style="margin-right: 0.5rem;background: #fff!important;border: 1px solid #005ec4!important;color: #005ec4!important;">
                                        <svg style="vertical-align: text-bottom;padding-right: 5px;" width="21" height="20"
                                            viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M8.00033 18.3334C8.46056 18.3334 8.83366 17.9603 8.83366 17.5001C8.83366 17.0398 8.46056 16.6667 8.00033 16.6667C7.54009 16.6667 7.16699 17.0398 7.16699 17.5001C7.16699 17.9603 7.54009 18.3334 8.00033 18.3334Z"
                                                stroke="#005EC4" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round"></path>
                                            <path
                                                d="M17.1663 18.3334C17.6266 18.3334 17.9997 17.9603 17.9997 17.5001C17.9997 17.0398 17.6266 16.6667 17.1663 16.6667C16.7061 16.6667 16.333 17.0398 16.333 17.5001C16.333 17.9603 16.7061 18.3334 17.1663 18.3334Z"
                                                stroke="#005EC4" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round"></path>
                                            <path
                                                d="M1.33301 0.833252H4.66634L6.89967 11.9916C6.97588 12.3752 7.1846 12.7199 7.4893 12.9652C7.79399 13.2105 8.17526 13.3407 8.56634 13.3333H16.6663C17.0574 13.3407 17.4387 13.2105 17.7434 12.9652C18.0481 12.7199 18.2568 12.3752 18.333 11.9916L19.6663 4.99992H5.49967"
                                                stroke="#005EC4" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round"></path>
                                        </svg>
                                        Giỏ hàng</button></a>
                            </div>
                        </div>
                    </div>
                    <span><a style="color: #005ec4;font-family: Chakra Petch; font-size: 1.5rem; display: flex;justify-content: flex-end;padding: 0.2rem 1rem 0 1rem;"
                            href="/store.html"> &larr;Trở về</a></span>
        
                </div>
            </div>
        
        
        
            <script>
                window.onscroll = function () { myFunction() };
        
                var navbar = document.getElementById("navbar");
                var sticky = navbar.offsetParent.offsetHeight - navbar.offsetTop - navbar.offsetHeight;
        
                function myFunction() {
                    if (window.pageYOffset >= sticky) {
                        navbar.classList.add("sticky")
                    } else {
                        navbar.classList.remove("sticky");
                    }
                }
                window.onbeforeunload = function () {
                    window.scrollTo(0, 0);
                }
            </script>
            <script src="/js/cart.js" async></script>
        </body>
        
        </html>`;
  res.status(200).send(html);
});

app.listen(configs.PORT, () => {
  console.log(`server started on port ${configs.PORT}`);
});
