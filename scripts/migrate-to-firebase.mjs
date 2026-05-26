import "dotenv/config";
import fs from "fs/promises";
import { shopRef } from "../server/firebase.mjs";

// Player → current shoe mapping copied verbatim from main.mjs at the time of migration.
const PLAYER_SHOES = {
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

// Diacritic-preserving slug — keeps "Luka Doncic" and "Luka Dončić" distinct.
function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "unknown";
}

function arrayToMap(arr, keyFn) {
  const out = {};
  for (const item of arr) {
    const key = keyFn(item);
    if (key === undefined || key === null || key === "") continue;
    out[key] = item;
  }
  return out;
}

async function main() {
  const db = JSON.parse(await fs.readFile("db/db.json", "utf8"));

  // products → /shop/products/{id}
  const products = arrayToMap(db.products || [], (p) => p.id);
  await shopRef("products").set(products);
  console.log(`✓ products: wrote ${Object.keys(products).length} entries`);

  // admins → /shop/admins/{username}
  await shopRef("admins").set(db.admins || {});
  console.log(`✓ admins: wrote ${Object.keys(db.admins || {}).length} entries`);

  // ids counter
  await shopRef("ids").set(db.ids || 0);
  console.log(`✓ ids counter: ${db.ids || 0}`);

  // hiddenPlayers → /shop/hiddenPlayers/{name}: true
  const hidden = {};
  for (const name of db.hiddenPlayers || []) hidden[slug(name)] = name;
  await shopRef("hiddenPlayers").set(hidden);
  console.log(`✓ hiddenPlayers: wrote ${Object.keys(hidden).length} entries`);

  // trendingShoeGallery → /shop/trendingShoeGallery/{id}
  // Fall back to static seed if db is empty.
  let gallery = db.trendingShoeGallery || [];
  if (!gallery.length) {
    try {
      gallery = JSON.parse(await fs.readFile("static/data/trending-shoes.json", "utf8"));
      console.log("  (using static/data/trending-shoes.json as seed)");
    } catch (_) { /* no seed file */ }
  }
  const galleryMap = arrayToMap(gallery, (p) => p.id);
  await shopRef("trendingShoeGallery").set(galleryMap);
  console.log(`✓ trendingShoeGallery: wrote ${Object.keys(galleryMap).length} entries`);

  // upcomingReleases → /shop/upcomingReleases/{id}
  const releases = arrayToMap(db.upcomingReleases || [], (r) => r.id);
  await shopRef("upcomingReleases").set(releases);
  console.log(`✓ upcomingReleases: wrote ${Object.keys(releases).length} entries`);

  // playerShoes → /shop/playerShoes/{slug}: { name, shoe, brand }
  const playerShoes = {};
  for (const [name, info] of Object.entries(PLAYER_SHOES)) {
    playerShoes[slug(name)] = { name, shoe: info.shoe, brand: info.brand };
  }
  await shopRef("playerShoes").set(playerShoes);
  console.log(`✓ playerShoes: wrote ${Object.keys(playerShoes).length} entries`);

  console.log("\nMigration complete. Check the Firebase console → Realtime Database → /shop");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
