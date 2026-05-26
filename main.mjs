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
import fs from "fs/promises";

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

db.data ||= { products: [] };
if (!Array.isArray(db.data.hiddenPlayers)) {
  db.data.hiddenPlayers = [];
  await db.write();
}

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

app.get("/firebase-config", (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  });
});

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

async function getTrendingShoeGallery() {
  await db.read();
  if (Array.isArray(db.data.trendingShoeGallery) && db.data.trendingShoeGallery.length) {
    return db.data.trendingShoeGallery;
  }
  const seed = await fs.readFile("static/data/trending-shoes.json", "utf8");
  return JSON.parse(seed);
}

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
    const hidden = new Set(db.data.hiddenPlayers || []);
    const players = rows
      .map((row) => {
        const name = row[idx.name] || "";
        const info = PLAYER_SHOES[name] || {};
        return {
          name,
          team:     row[idx.team] || "",
          ppg:      Number(row[idx.pts]).toFixed(1),
          headshot: `https://cdn.nba.com/headshots/nba/latest/260x190/${row[idx.id]}.png`,
          shoe:     info.shoe || null,
          brand:    info.brand || null,
        };
      })
      .filter(p => !hidden.has(p.name))
      .slice(0, 10)
      .map((p, i) => ({ ...p, rank: i + 1 }));
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

app.get("/trends/shoe-gallery", async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    res.json({ players: await getTrendingShoeGallery() });
  } catch (e) {
    res.status(500).json({ players: [] });
  }
});

app.get("/productlist", async (req, res) => {
  await db.read();
  res.set("Cache-Control", "no-store");
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
    const now = new Date().toISOString();
    db.data.ids++;
    db.data.products.push({ name, alt, banner, images, price, filter, mouseover, mouseout, cartpic, options, id: db.data.ids, dateAdded: now, dateModified: now });
    await db.write();
    res.status(200).send();
});

app.get("/admin/products", requireAdmin, async (req, res) => {
    await db.read();
    res.set("Cache-Control", "no-store");
    res.json({ products: db.data.products });
});

app.put("/admin/products/:id", requireAdmin, async (req, res) => {
    await db.read();
    const id = parseInt(req.params.id, 10);
    const idx = db.data.products.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).send();

    const { name, alt, banner, images, price, filter, mouseover, mouseout, cartpic, options } = req.body;
    if (!name || !alt || !banner || !Array.isArray(images) || !images.length || !price || !filter || !mouseover || !mouseout || !cartpic || !Array.isArray(options) || !options.length) {
        return res.status(400).send();
    }

    db.data.products[idx] = { ...db.data.products[idx], name, alt, banner, images, price, filter, mouseover, mouseout, cartpic, options, id, dateModified: new Date().toISOString() };
    await db.write();
    res.status(200).json({ product: db.data.products[idx] });
});

app.delete("/admin/products/:id", requireAdmin, async (req, res) => {
    await db.read();
    const id = parseInt(req.params.id, 10);
    const idx = db.data.products.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).send();
    db.data.products.splice(idx, 1);
    await db.write();
    res.status(200).send();
});

app.delete("/admin/products", requireAdmin, async (req, res) => {
    await db.read();
    const ids = req.body?.ids;
    if (!Array.isArray(ids) || !ids.length) return res.status(400).send();
    const idSet = new Set(ids.map(Number));
    db.data.products = db.data.products.filter(p => !idSet.has(p.id));
    await db.write();
    res.status(200).send();
});

app.get("/admin/players/hidden", requireAdmin, (req, res) => {
    res.json({ hidden: db.data.hiddenPlayers || [] });
});

app.post("/admin/players/hide", requireAdmin, async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).send();
    if (!db.data.hiddenPlayers.includes(name)) {
        db.data.hiddenPlayers.push(name);
        await db.write();
        trendsCache.players.ts = 0;
    }
    res.status(200).send();
});

app.delete("/admin/players/hide/:name", requireAdmin, async (req, res) => {
    const name = decodeURIComponent(req.params.name);
    db.data.hiddenPlayers = db.data.hiddenPlayers.filter(n => n !== name);
    await db.write();
    trendsCache.players.ts = 0;
    res.status(200).send();
});

app.get("/admin/shoe-gallery", requireAdmin, async (req, res) => {
    try {
        res.set("Cache-Control", "no-store");
        res.json({ players: await getTrendingShoeGallery() });
    } catch (e) {
        res.status(500).json({ players: [] });
    }
});

app.put("/admin/shoe-gallery/:rank", requireAdmin, async (req, res) => {
    await db.read();
    const oldRank = parseInt(req.params.rank, 10);
    let gallery = Array.isArray(db.data.trendingShoeGallery) && db.data.trendingShoeGallery.length
        ? db.data.trendingShoeGallery
        : await getTrendingShoeGallery();

    // Normalize first: sort by current rank, then renumber 1..N to clear any duplicate/gap state.
    gallery = gallery.slice().sort((a, b) => a.rank - b.rank);
    gallery.forEach((p, i) => { p.rank = i + 1; });

    const bodyId = req.body.id ? parseInt(req.body.id, 10) : null;
    // Prefer matching by unique player id; fall back to rank if no id provided.
    let idx = bodyId ? gallery.findIndex(p => parseInt(p.id, 10) === bodyId) : -1;
    if (idx === -1) idx = gallery.findIndex(p => p.rank === oldRank);
    if (idx === -1) return res.status(404).send();

    const rank = parseInt(req.body.rank, 10);
    const id = bodyId || gallery[idx].id || 0;
    const { name, avatar, team, shoe, brand, freeAgent, shoeImgs } = req.body;
    if (!rank || !name || !team || !shoe || !brand || !Array.isArray(shoeImgs) || !shoeImgs.length) {
        return res.status(400).send();
    }

    // Normalize shoeImgs to {url, name} objects
    const normalizedImgs = shoeImgs
        .map(img => typeof img === "string" ? { url: img, name: "" } : { url: img.url || "", name: img.name || "" })
        .filter(img => img.url);
    if (!normalizedImgs.length) return res.status(400).send();

    const updated = { rank, name, avatar: avatar || null, team, id, shoe, brand, freeAgent: Boolean(freeAgent), shoeImgs: normalizedImgs };

    // Reorder: remove the edited entry, insert at the target rank, then renumber 1..N
    const others = gallery.filter((_, i) => i !== idx);
    const targetIndex = Math.max(0, Math.min(others.length, rank - 1));
    others.splice(targetIndex, 0, updated);
    others.forEach((p, i) => { p.rank = i + 1; });

    db.data.trendingShoeGallery = others;
    await db.write();
    res.status(200).json({ player: others[targetIndex] });
});


// ── Upcoming Releases ──────────────────────────────────────────
app.get("/upcoming-releases", async (req, res) => {
  await db.read();
  res.set("Cache-Control", "no-store");
  res.json({ releases: (db.data.upcomingReleases || []).sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate)) });
});

app.get("/admin/upcoming-releases", requireAdmin, async (req, res) => {
  await db.read();
  res.set("Cache-Control", "no-store");
  res.json({ releases: (db.data.upcomingReleases || []).sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate)) });
});

app.post("/admin/upcoming-releases", requireAdmin, async (req, res) => {
  const { name, imageUrl, linkUrl, releaseDate, description } = req.body;
  if (!name || !imageUrl || !releaseDate) return res.status(400).send();
  await db.read();
  if (!Array.isArray(db.data.upcomingReleases)) db.data.upcomingReleases = [];
  const id = db.data.upcomingReleases.reduce((max, r) => Math.max(max, r.id || 0), 0) + 1;
  const item = { id, name, imageUrl, linkUrl: linkUrl || "", releaseDate, description: description || "" };
  db.data.upcomingReleases.push(item);
  db.data.upcomingReleases.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
  await db.write();
  res.status(200).json({ release: item });
});

app.put("/admin/upcoming-releases/:id", requireAdmin, async (req, res) => {
  await db.read();
  const id = parseInt(req.params.id, 10);
  const idx = (db.data.upcomingReleases || []).findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).send();
  const { name, imageUrl, linkUrl, releaseDate, description } = req.body;
  if (!name || !imageUrl || !releaseDate) return res.status(400).send();
  db.data.upcomingReleases[idx] = { id, name, imageUrl, linkUrl: linkUrl || "", releaseDate, description: description || "" };
  db.data.upcomingReleases.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
  await db.write();
  res.status(200).json({ release: db.data.upcomingReleases.find(r => r.id === id) });
});

app.delete("/admin/upcoming-releases/:id", requireAdmin, async (req, res) => {
  await db.read();
  const id = parseInt(req.params.id, 10);
  const idx = (db.data.upcomingReleases || []).findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).send();
  db.data.upcomingReleases.splice(idx, 1);
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

  const isShoe = item.filter === 'concert' || item.filter === 'band';
  // Normalize options: accept both legacy string[] and new {size,oos}[] format
  const opts = (item.options || []).map(o => typeof o === 'string' ? { size: o, oos: false } : o);
  const optionsHtml = opts.map(o =>
    `<option value="${o.size}"${o.oos ? ' disabled data-oos="true"' : ''}>${o.size}${o.oos ? ' — Out of Stock' : ''}</option>`
  ).join('');
  const selectLabel = isShoe ? 'Select Size' : (
    opts.some(o => /^\d+(\.\d+)?$|^(XS|S|M|L|XL|2XL|XXL|3XL|XXXL|US\s*\d)/i.test((o.size || '').trim()))
      ? 'Select Size' : 'Select Option'
  );
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

    /* ── Sticky bar ───────────────────────────────────── */
    .sticky-bar {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: #fff;
      border-top: 1px solid #e8e8e8;
      box-shadow: 0 -4px 24px rgba(0,0,0,0.1);
      z-index: 100;
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .sticky-bar.visible { transform: translateY(0); }

    .bar-inner {
      max-width: 1200px;
      margin: 0 auto;
      height: 62px;
      padding: 0 28px;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .bar-name {
      font-family: 'Chakra Petch', sans-serif;
      font-size: 0.88rem;
      font-weight: 700;
      color: #1a1a1a;
      letter-spacing: 0.02em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      min-width: 0;
    }

    .size-select {
      flex-shrink: 0;
      height: 36px;
      padding: 0 10px;
      background: #fff;
      border: 1px solid #d0d0d0;
      color: #333;
      font-family: 'Chakra Petch', sans-serif;
      font-size: 0.74rem;
      font-weight: 500;
      letter-spacing: 0.04em;
      cursor: pointer;
      outline: none;
      transition: border-color 0.2s;
    }
    .size-select:focus { border-color: #005ec4; }

    .bar-price {
      font-family: 'Chakra Petch', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: #f9495f;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .btn-add {
      flex-shrink: 0;
      height: 40px;
      padding: 0 26px;
      background: #005ec4;
      color: #fff;
      font-family: 'Chakra Petch', sans-serif;
      font-size: 0.74rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      cursor: pointer;
      border: none;
      white-space: nowrap;
      transition: background 0.2s, transform 0.1s;
    }
    .btn-add:hover { background: #0051a8; }
    .btn-add:active { transform: scale(0.97); }

    .btn-view {
      flex-shrink: 0;
      height: 40px;
      padding: 0 18px;
      background: #fff;
      color: #005ec4;
      font-family: 'Chakra Petch', sans-serif;
      font-size: 0.74rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border: 1px solid #005ec4;
      text-decoration: none;
      display: flex;
      align-items: center;
      white-space: nowrap;
      transition: border-color 0.2s, color 0.2s;
    }
    .btn-view:hover { color: #fa9f2c; border-color: #fa9f2c; }

    @media (max-width: 600px) {
      .bar-inner { gap: 10px; padding: 0 14px; }
      .btn-view { display: none; }
    }

    /* Floating back button */
    .back-btn {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 200;
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 9px 18px 9px 13px;
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 100px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.12);
      font-family: 'Chakra Petch', sans-serif;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #1a1a1a;
      text-decoration: none;
      opacity: 0;
      pointer-events: none;
      transform: translateY(-8px);
      transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.2s ease, background 0.2s ease;
    }
    .back-btn.visible {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }
    .back-btn.visible:hover {
      transform: translateX(-3px);
      box-shadow: 0 4px 24px rgba(0,0,0,0.18);
      background: rgba(255,255,255,0.97);
    }
    .back-btn-arrow {
      font-size: 1rem;
      line-height: 1;
      transition: transform 0.2s ease;
    }
    .back-btn.visible:hover .back-btn-arrow { transform: translateX(-2px); }
  </style>
</head>
<body>

  <a href="/store.html" class="back-btn">
    <span class="back-btn-arrow">&#8592;</span>Store
  </a>

  <div class="hero">
    <img id="heroImg" src="${item.banner}" alt="${item.name}">
  </div>

  <div class="gallery">
    ${imagesHtml}
  </div>

  <div class="sticky-bar" id="stickyBar">
    <div class="bar-inner">
      <span class="bar-name">${item.name}</span>
      <select class="size-select" id="sizeSelect">
        <option value="" disabled selected>${selectLabel}</option>
        ${optionsHtml}
      </select>
      <span class="bar-price">${usdPrice}</span>
      <button class="btn-add" id="addCartBtn">Add to Cart</button>
      <a href="/cart.html" class="btn-view">Cart</a>
    </div>
  </div>

  <script>
    const product = ${productJson};

    const bar = document.getElementById('stickyBar');
    const backBtn = document.querySelector('.back-btn');
    window.addEventListener('scroll', () => {
      const past = window.scrollY > 3;
      bar.classList.toggle('visible', past);
      backBtn.classList.toggle('visible', past);
    }, { passive: true });

    document.getElementById('addCartBtn').addEventListener('click', () => {
      const sel = document.getElementById('sizeSelect');
      const selectedSize = sel.value;
      if (!selectedSize) {
        Swal.fire({ icon: 'info', title: '${selectLabel}', confirmButtonColor: '#005ec4' });
        return;
      }
      const opt = sel.options[sel.selectedIndex];
      if (opt && opt.dataset.oos === 'true') {
        Swal.fire({ icon: 'error', title: 'Out of Stock', text: 'This size is sold out. Please choose another.', confirmButtonColor: '#005ec4' });
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
