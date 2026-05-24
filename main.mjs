import "dotenv/config";
import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import fetch from "node-fetch";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import session from "express-session";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";

const db = new Low(new JSONFile("db/db.json"));
const app = express();
let transporter = nodemailer.createTransport({
  host: "smtp.elasticemail.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.MAILUSER,
    pass: process.env.MAILPASSWORD,
  },
});
await db.read();

function findbyproductname(products, name) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].name === name) return products[i];
  }
  return {};
}

// Migrate any plaintext admin passwords to bcrypt hashes on startup
async function migrateAdminPasswords() {
  let changed = false;
  for (const [username, password] of Object.entries(db.data.admins)) {
    if (!password.startsWith("$2b$")) {
      db.data.admins[username] = await bcrypt.hash(password, 12);
      changed = true;
    }
  }
  if (changed) await db.write();
}
await migrateAdminPasswords();

db.data ||= {
  products: [],
};

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 },
}));

app.use("/", express.static("static"));
app.use("/admin", express.static("admin"));
app.use(bodyParser.json());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts, please try again later.",
});

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  res.status(401).send("Unauthorized");
}

// In-memory news cache — avoids polluting db.json
let newsCache = { hour: null, arr: [] };

app.get("/news", async (req, res) => {
  const d = new Date();
  const currentHour = `${d.getUTCHours()}${d.getUTCDate()}${d.getUTCMonth()}${d.getUTCFullYear()}`;

  if (newsCache.hour !== currentHour) {
    const a = await fetch(
      `https://newsdata.io/api/1/news?apikey=${process.env.NEWS_API_KEY}&q=nba&language=en&category=sports`
    );
    const data = await a.json();
    if (Array.isArray(data.results)) {
      newsCache = {
        hour: currentHour,
        arr: data.results.filter(
          (el) => el.image_url !== null && el.description !== null
        ),
      };
    }
  }

  res.status(200).json({ news: newsCache.arr });
});

app.get("/nba-stories", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.usestoryteller.com/api/app/story/stories/default?categories=top-stories&ClientPlatform=Web&ClientVersion=10.9.0&userAttributes[location]=US&x-storyteller-api-key=c0432170-1011-4a36-b0f9-595c62c2243f"
    );
    const data = await response.json();
    const stories = (data.stories || []).slice(0, 8).map(s => ({
      id: s.id,
      title: s.titles.longDisplay || s.titles.shortDisplay || s.title,
      thumbnail: s.thumbnails?.medium || s.thumbnails?.large || s.thumbnailUrl,
      timestamp: s.timestamp,
      url: s.webStoryUrl,
      isLive: s.isLive,
    }));
    res.json({ stories });
  } catch (e) {
    res.status(500).json({ stories: [] });
  }
});

// Player → current shoe mapping (2025-26 season, verified)
const PLAYER_SHOES = {
  // Top 10 scorers — corrected
  "Luka Doncic":             { shoe: "Jordan Luka 5",           brand: "Jordan" },
  "Luka Dončić":             { shoe: "Jordan Luka 5",           brand: "Jordan" },
  "Shai Gilgeous-Alexander": { shoe: "Converse SHAI 001",       brand: "Converse" },
  "Anthony Edwards":         { shoe: "Adidas AE 2",             brand: "Adidas" },
  "Jaylen Brown":            { shoe: "741 Performance Rover",   brand: "741" },
  "Tyrese Maxey":            { shoe: "New Balance Maxey v1",    brand: "New Balance" },
  "Kawhi Leonard":           { shoe: "New Balance KAWHI V",     brand: "New Balance" },
  "Donovan Mitchell":        { shoe: "Adidas DON Issue 7",      brand: "Adidas" },
  "Nikola Jokic":            { shoe: "361° Joker 2",            brand: "361°" },
  "Nikola Jokić":            { shoe: "361° Joker 2",            brand: "361°" },
  "Devin Booker":            { shoe: "Nike Book 2",             brand: "Nike" },
  "Jalen Brunson":           { shoe: "Nike Kobe 4 Protro",      brand: "Nike" },
  // Other notable players
  "LeBron James":            { shoe: "Nike LeBron 22",          brand: "Nike" },
  "Kevin Durant":            { shoe: "Nike KD 17",              brand: "Nike" },
  "Giannis Antetokounmpo":   { shoe: "Nike Zoom Freak 6",       brand: "Nike" },
  "Stephen Curry":           { shoe: "Under Armour Curry 12",   brand: "Under Armour" },
  "Jayson Tatum":            { shoe: "Jordan Tatum 3",          brand: "Jordan" },
  "Joel Embiid":             { shoe: "Under Armour Embiid 2",   brand: "Under Armour" },
  "Damian Lillard":          { shoe: "Adidas Dame 9",           brand: "Adidas" },
  "Ja Morant":               { shoe: "Nike Ja 2",               brand: "Nike" },
  "Trae Young":              { shoe: "Adidas Trae Young 3",     brand: "Adidas" },
  "Zion Williamson":         { shoe: "Jordan Zion 4",           brand: "Jordan" },
  "Anthony Davis":           { shoe: "Nike AD",                 brand: "Nike" },
  "Karl-Anthony Towns":      { shoe: "Nike Air Zoom GT Jump 2", brand: "Nike" },
  "Paolo Banchero":          { shoe: "Nike GT Cut 3",           brand: "Nike" },
  "Tyrese Haliburton":       { shoe: "Nike KD 17",              brand: "Nike" },
  "Cade Cunningham":         { shoe: "Nike Kobe 8 Protro",      brand: "Nike" },
  "Bam Adebayo":             { shoe: "Nike Air Zoom GT Cut 3",  brand: "Nike" },
};

let trendsCache = {
  players:  { ts: 0, data: [] },
  sneakers: { ts: 0, data: [] },
};
const TRENDS_TTL = 3600 * 1000; // 1 hour

const NBA_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

app.get("/trends/players", async (req, res) => {
  try {
    const now = Date.now();
    if (now - trendsCache.players.ts < TRENDS_TTL) {
      return res.json({ players: trendsCache.players.data });
    }
    const r = await fetch(
      "https://stats.nba.com/stats/leagueLeaders?LeagueID=00&PerMode=PerGame&Scope=S&Season=2025-26&SeasonType=Regular+Season&StatCategory=PTS",
      { headers: { "Referer": "https://www.nba.com/", "Origin": "https://www.nba.com", "User-Agent": NBA_UA } }
    );
    const data = await r.json();
    const headers = data.resultSet?.headers || [];
    const rows = data.resultSet?.rowSet || [];
    const idx = { id: headers.indexOf("PLAYER_ID"), name: headers.indexOf("PLAYER"), team: headers.indexOf("TEAM"), pts: headers.indexOf("PTS") };
    const players = rows.slice(0, 10).map((row, i) => {
      const name = row[idx.name] || "";
      const info = PLAYER_SHOES[name] || {};
      return {
        rank:     i + 1,
        name,
        team:     row[idx.team] || "",
        ppg:      Number(row[idx.pts]).toFixed(1),
        headshot: `https://cdn.nba.com/headshots/nba/latest/260x190/${row[idx.id]}.png`,
        shoe:     info.shoe || null,
        brand:    info.brand || null,
      };
    });
    trendsCache.players = { ts: now, data: players };
    res.json({ players });
  } catch (e) {
    res.status(500).json({ players: [] });
  }
});

app.get("/trends/sneakers", async (req, res) => {
  try {
    const now = Date.now();
    if (now - trendsCache.sneakers.ts < TRENDS_TTL) {
      return res.json({ sneakers: trendsCache.sneakers.data });
    }
    const r = await fetch(
      "https://www.reddit.com/r/Sneakers/hot/.json?limit=30",
      { headers: { "User-Agent": NBA_UA } }
    );
    const data = await r.json();
    const sneakers = (data.data?.children || [])
      .map(p => p.data)
      .filter(p => !p.is_self)
      .map(p => {
        const thumb =
          p.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&") ||
          (p.thumbnail?.startsWith("http") ? p.thumbnail : null);
        return { title: p.title, url: `https://www.reddit.com${p.permalink}`, thumbnail: thumb, score: p.score, comments: p.num_comments };
      })
      .filter(p => p.thumbnail)
      .slice(0, 8);
    trendsCache.sneakers = { ts: now, data: sneakers };
    res.json({ sneakers });
  } catch (e) {
    res.status(500).json({ sneakers: [] });
  }
});

app.get("/productlist", async (req, res) => {
  res.status(200).json(db.data);
});

app.get("/pdcnt", async (req, res) => {
  res.status(200).json({
    count: db.data.ids,
  });
});

app.get("/mail", async (req, res) => {
  const address = req.query.mail;
  await transporter.sendMail({
    from: `"BasketballShop" <${process.env.MAILUSER}>`,
    to: address,
    subject: "Newsletter",
    text: "Thank you for subscribing to the BasketballShop newsletter.\nWe'll send you the latest NBA updates.",
    html: `Thank you for subscribing to the BasketballShop newsletter.<br>We'll send you the latest NBA updates.<br>This is an automated message, please do not reply.<br><img src="https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/304881059_107600002091807_5624213785648279587_n.png?_nc_cat=108&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=g35yFBvN5ZwAX8ufcDE&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfBC--swpZWsUuHSWclaxQ99wqqSeY0Dp2M6uL4JXXIXrA&oe=63C701EF" alt="BasketballShop" width=200 height=200>
        `,
  });
  res.status(200).send("successful");
});

app.get("/admin", (req, res) => {
    res.redirect("/admin/product.html");
});

app.get("/admin/checkauth", (req, res) => {
    if (req.session && req.session.isAdmin) return res.status(200).send();
    res.status(401).send();
});

app.post("/admin/login", loginLimiter, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send();
    const stored = db.data.admins[username];
    if (!stored) return res.status(401).send();
    const valid = await bcrypt.compare(password, stored);
    if (!valid) return res.status(401).send();
    req.session.isAdmin = true;
    req.session.username = username;
    res.status(200).send();
});

app.post("/admin/logout", (req, res) => {
    req.session.destroy();
    res.status(200).send();
});

app.post("/admin/addproduct", requireAdmin, async (req, res) => {
    const { name, alt, banner, images, price, filter, mouseover, mouseout, cartpic, options } = req.body;
    if (!name || !alt || !banner || !images || !price || !filter || !mouseover || !mouseout || !cartpic || !options) {
        return res.status(400).send();
    }
    db.data.ids++;
    db.data.products.push({ name, alt, banner, images, price, filter, mouseover, mouseout, cartpic, options, id: db.data.ids });
    await db.write();
    res.status(200).send();
});

app.get("/store_item", async (req, res) => {
  const itemName = req.query.item;
  const item = findbyproductname(db.data.products, itemName);
  const vnd = parseInt(String(item.price).replace(/\./g, ''), 10);
  const usdRaw = vnd / 25000;
  const usdMarketing = Math.ceil(usdRaw / 5) * 5 - 0.01;
  const usdPrice = isNaN(vnd) ? item.price : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usdMarketing);
  const imagesHtml = item.images.map(img =>
    `<div class="gallery-slide"><img src="${img}" alt="${item.alt}" onerror="this.parentElement.remove()"></div>`
  ).join('');
  const chipsHtml = item.options.map(o =>
    `<button class="chip" data-value="${o}">${o}</button>`
  ).join('');
  // Safe JSON for inline JS — avoids quote-escaping issues
  const productJson = JSON.stringify({ cartpic: item.cartpic, name: item.name, price: usdPrice, id: item.id });
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${item.name}</title>
  <link rel="icon" type="image/x-icon" href="/images/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;700&display=swap" rel="stylesheet">
  <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: rgb(242, 242, 242);
      font-family: Arial, Helvetica, sans-serif;
      scrollbar-width: none;
      transition: background 0.8s ease;
    }
    body::-webkit-scrollbar { display: none; }

    /* Full-screen hero — full picture, no cropping */
    .hero {
      width: 100vw;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgb(242, 242, 242);
    }
    .hero img {
      width: 100%;
      height: auto;
      display: block;
      max-height: 100vh;
      object-fit: contain;
    }

    /* Gallery — each image fills the viewport, full picture visible */
    .gallery {
      padding-bottom: 160px;
    }
    .gallery-slide {
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgb(242, 242, 242);
      margin-bottom: 1.5rem;
    }
    .gallery-slide img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    /* Sticky bar — hidden off-screen until scroll */
    .sticky-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #fff;
      border-top: 1px solid #e0e0e0;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
      z-index: 100;
      transform: translateY(100%);
      transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .sticky-bar.visible { transform: translateY(0); }

    /* Bar top row: name + price + buttons */
    .bar-top {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px 8px;
      border-bottom: 1px solid #f0f0f0;
    }
    .bar-name {
      font-family: 'Chakra Petch', sans-serif;
      font-size: 0.9rem;
      font-weight: 700;
      color: #1a1a1a;
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bar-price {
      font-family: 'Chakra Petch', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: #f9495f;
      white-space: nowrap;
    }
    .btn {
      height: 40px;
      padding: 0 16px;
      font-family: 'Chakra Petch', sans-serif;
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      cursor: pointer;
      border: none;
      display: flex;
      align-items: center;
      gap: 5px;
      text-decoration: none;
      white-space: nowrap;
    }
    .btn-add  { background: #005ec4; color: #fff; }
    .btn-add:hover { background: #0051a8; }
    .btn-view { background: #fff; color: #005ec4; border: 1px solid #005ec4; }
    .btn-view:hover { color: #fa9f2c; border-color: #fa9f2c; }

    /* Bar bottom row: size chips */
    .bar-sizes { padding: 8px 16px 12px; }
    .size-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 7px;
    }
    .size-header span {
      font-family: 'Chakra Petch', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #1a1a1a;
    }
    .size-header a {
      font-family: 'Chakra Petch', sans-serif;
      font-size: 0.72rem;
      color: #888;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .chips-row {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 2px;
    }
    .chips-row::-webkit-scrollbar { display: none; }
    .chip {
      flex-shrink: 0;
      height: 34px;
      padding: 0 11px;
      border: 1.5px solid #d0d0d0;
      background: #fff;
      font-family: 'Chakra Petch', sans-serif;
      font-size: 0.76rem;
      color: #1a1a1a;
      cursor: pointer;
      white-space: nowrap;
      transition: border-color 0.12s, background 0.12s, color 0.12s;
    }
    .chip:hover { border-color: #1a1a1a; }
    .chip.selected { border-color: #1a1a1a; background: #1a1a1a; color: #fff; }

    @media (max-width: 600px) {
      .bar-top { flex-wrap: wrap; }
      .bar-name { flex-basis: 100%; }
    }
  </style>
</head>
<body>

  <div class="hero">
    <img id="heroImg" src="${item.banner}" alt="${item.name}">
  </div>

  <div class="gallery">
    ${imagesHtml}
  </div>

  <div class="sticky-bar" id="stickyBar">
    <div class="bar-top">
      <span class="bar-name">${item.name}</span>
      <span class="bar-price">${usdPrice}</span>
      <button class="btn btn-add" id="addCartBtn">+ Add to Cart</button>
      <a href="/cart.html" class="btn btn-view">View Cart</a>
    </div>
    <div class="bar-sizes">
      <div class="size-header">
        <span>Select Size</span>
        <a href="https://www.nike.com/size-fit/unisex-footwear-mens-based" target="_blank" rel="noopener">Size Guide</a>
      </div>
      <div class="chips-row">${chipsHtml}</div>
    </div>
  </div>

  <script>
    const product = ${productJson};
    let selectedSize = null;

    // Show bar only after scrolling 60% past the hero
    const bar = document.getElementById('stickyBar');
    window.addEventListener('scroll', () => {
      bar.classList.toggle('visible', window.scrollY >3);
    }, { passive: true });

    // Size chip selection
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        selectedSize = chip.dataset.value;
      });
    });

    // Add to cart — require size first
    document.getElementById('addCartBtn').addEventListener('click', () => {
      if (!selectedSize) {
        Swal.fire({ icon: 'info', title: 'Select a size', confirmButtonColor: '#005ec4' });
        return;
      }
      addsp(product.cartpic, product.name, selectedSize, product.price, product.id);
    });

  </script>
  <script src="/js/cart.js" async></script>
</body>
</html>`;
  res.status(200).send(html);
});

app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT}`);
});
