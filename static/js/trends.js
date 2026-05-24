const TRENDING_PLAYERS = [
  { rank: 1,  name: "Victor Wembanyama",       team: "SAS", id: 1641705, shoe: "Nike G.T. Cut 4 / G.T. Hustle 3", brand: "Nike" },
  { rank: 2,  name: "Shai Gilgeous-Alexander", team: "OKC", id: 1628983, shoe: "Converse SHAI 001",               brand: "Converse" },
  { rank: 3,  name: "LeBron James",            team: "LAL", id: 2544,    shoe: "Nike LeBron 23",                  brand: "Nike" },
  { rank: 4,  name: "Kevin Durant",            team: "HOU", id: 201142,  shoe: "Nike KD 18",                      brand: "Nike" },
  { rank: 5,  name: "Stephen Curry",           team: "GSW", id: 201939,  shoe: "Under Armour Curry 13",           brand: "Under Armour" },
  { rank: 6,  name: "Chet Holmgren",           team: "OKC", id: 1631096, shoe: "Nike KD 18",                      brand: "Nike" },
  { rank: 7,  name: "Jalen Brunson",           team: "NYK", id: 1628973, shoe: "Nike Kobe 4 Protro",              brand: "Nike" },
  { rank: 8,  name: "Karl-Anthony Towns",      team: "NYK", id: 1626157, shoe: "Nike GT Jump 2",                  brand: "Nike" },
  { rank: 9,  name: "Donovan Mitchell",        team: "CLE", id: 1628378, shoe: "Adidas D.O.N. Issue 7",           brand: "Adidas" },
  { rank: 10, name: "Evan Mobley",             team: "CLE", id: 1630596, shoe: "Adidas AE2",                      brand: "Adidas" },
];

const BRAND_COLORS = {
  "Nike":          "#e5e5e5",
  "Jordan":        "#c8102e",
  "Adidas":        "#fff",
  "Under Armour":  "#1a9dff",
  "New Balance":   "#cf102d",
  "Converse":      "#fff",
  "361°":          "#00aaff",
  "741":           "#b8ff00",
  "Puma":          "#00a19a",
  "Li-Ning":       "#d4000f",
};

(async () => {
  const container = document.getElementById("players-list");
  try {
    const { players } = await (await fetch("/trends/players")).json();
    if (!players || players.length === 0) {
      container.innerHTML = '<p style="color:#848484">Could not load player stats.</p>';
      return;
    }
    container.innerHTML = players.map(p => {
      const brandColor = p.brand ? (BRAND_COLORS[p.brand] || "#fd5927") : "#fd5927";
      return `
        <div class="player-row">
          <span class="player-rank">${p.rank}</span>
          ${p.headshot
            ? `<img src="${p.headshot}" alt="${p.name}" class="player-headshot">`
            : `<div class="player-headshot"></div>`}
          <div class="player-info">
            <div class="player-name">${p.name}</div>
            <div class="player-team">${p.team}</div>
            ${p.shoe
              ? `<div class="player-shoe">
                   <span class="shoe-brand" style="color:${brandColor}">${p.brand}</span>
                   ${p.shoe}
                 </div>`
              : ""}
          </div>
          <div class="player-ppg">${p.ppg}<span class="ppg-label">PPG</span></div>
        </div>`;
    }).join("");
  } catch (e) {
    container.innerHTML = '<p style="color:#848484">Could not load player stats.</p>';
  }
})();

(async () => {
  const grid = document.getElementById("sneakers-grid");
  try {
    const { sneakers } = await (await fetch("/trends/sneakers")).json();
    if (!sneakers || sneakers.length === 0) {
      grid.innerHTML = '<p style="color:#848484">No trending sneakers found.</p>';
      return;
    }
    grid.innerHTML = sneakers.map(s => `
      <a href="${s.url}" target="_blank" rel="noopener" class="sneaker-card">
        <div class="sneaker-thumb" style="background-image:url('${s.thumbnail}')"></div>
        <div class="sneaker-info">
          <p class="sneaker-title">${s.title}</p>
          <div class="sneaker-meta">
            <span>&#9650; ${s.score.toLocaleString()}</span>
            <span>&#128172; ${s.comments}</span>
          </div>
        </div>
      </a>`).join("");
  } catch (e) {
    grid.innerHTML = '<p style="color:#848484">Could not load trending sneakers.</p>';
  }
})();

// Hardcoded trending players ranking
const trendingEl = document.getElementById("trending-players");
if (trendingEl) {
  trendingEl.innerHTML = TRENDING_PLAYERS.map(p => {
    const brandColor = BRAND_COLORS[p.brand] || "#fd5927";
    return `
      <div class="player-row">
        <span class="player-rank">${p.rank}</span>
        <img src="https://cdn.nba.com/headshots/nba/latest/260x190/${p.id}.png"
             alt="${p.name}" class="player-headshot"
             onerror="this.style.opacity='0'">
        <div class="player-info">
          <div class="player-name">${p.name}</div>
          <div class="player-team">${p.team}</div>
          <div class="player-shoe">
            <span class="shoe-brand" style="color:${brandColor}">${p.brand}</span>
            ${p.shoe}
          </div>
        </div>
      </div>`;
  }).join("");
}
