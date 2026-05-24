const TRENDING_PLAYERS = [
  {
    rank: 1, name: "Victor Wembanyama", team: "SAS", id: 1641705,
    shoe: "Nike G.T. Cut 4", brand: "Nike",
    shoeImgs: [
      "https://images.stockx.com/360/Nike-Air-Zoom-GT-Cut-4-Victor-Wembanyama-All-Star/Images/Nike-Air-Zoom-GT-Cut-4-Victor-Wembanyama-All-Star/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-Air-Zoom-GT-Cut-4-Victor-Wembanyama-All-Star/Images/Nike-Air-Zoom-GT-Cut-4-Victor-Wembanyama-All-Star/Lv2/img02.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-Air-Zoom-GT-Cut-4-Preheat/Images/Nike-Air-Zoom-GT-Cut-4-Preheat/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-Air-Zoom-GT-Cut-4-Kay-Yow/Images/Nike-Air-Zoom-GT-Cut-4-Kay-Yow/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-Air-Zoom-GT-Cut-4-Bruce-Lee/Images/Nike-Air-Zoom-GT-Cut-4-Bruce-Lee/Lv2/img01.jpg?w=700&q=90&h=500",
    ]
  },
  {
    rank: 2, name: "Shai Gilgeous-Alexander", team: "OKC", id: 1628983,
    shoe: "Converse SHAI 001", brand: "Converse",
    shoeImgs: [
      "https://images.stockx.com/360/Converse-SHAI-001-Butter/Images/Converse-SHAI-001-Butter/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Converse-SHAI-001-Masi-Blue/Images/Converse-SHAI-001-Masi-Blue/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Converse-SHAI-001-Hail-Clay/Images/Converse-SHAI-001-Hail-Clay/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Converse-SHAI-001-Clean-Slate/Images/Converse-SHAI-001-Clean-Slate/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Converse-SHAI-001-Winter-Red/Images/Converse-SHAI-001-Winter-Red/Lv2/img01.jpg?w=700&q=90&h=500",
    ]
  },
  {
    rank: 3, name: "LeBron James", team: "LAL", id: 2544,
    shoe: "Nike LeBron XXIII", brand: "Nike",
    shoeImgs: [
      "https://images.stockx.com/360/Nike-LeBron-23-Miami-Twice/Images/Nike-LeBron-23-Miami-Twice/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-LeBron-23-Best-in-Class/Images/Nike-LeBron-23-Best-in-Class/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-LeBron-23-Grand-Opening/Images/Nike-LeBron-23-Grand-Opening/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-LeBron-23-The-Chosen-One-and-The-One-Who-Chose/Images/Nike-LeBron-23-The-Chosen-One-and-The-One-Who-Chose/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-LeBron-23-40K-Gold/Images/Nike-LeBron-23-40K-Gold/Lv2/img01.jpg?w=700&q=90&h=500",
    ]
  },
  {
    rank: 4, name: "Kevin Durant", team: "HOU", id: 201142,
    shoe: "Nike KD 18", brand: "Nike",
    shoeImgs: [
      "https://images.stockx.com/360/Nike-KD-18-Seat-Pleasant/Images/Nike-KD-18-Seat-Pleasant/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-KD-18-Black-Label/Images/Nike-KD-18-Black-Label/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-KD-18-Rise/Images/Nike-KD-18-Rise/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-KD-18-Aunt-Pearl/Images/Nike-KD-18-Aunt-Pearl/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-KD-18-LX-All-Star-Warning-Label/Images/Nike-KD-18-LX-All-Star-Warning-Label/Lv2/img01.jpg?w=700&q=90&h=500",
    ]
  },
  {
    rank: 5, name: "Stephen Curry", team: "GSW", id: 201939,
    shoe: "Nike · Li-Ning · Anta", brand: "Free Agent",
    freeAgent: true,
    shoeImgs: [
      "https://images.stockx.com/360/Nike-Kobe-4-Protro-Snake/Images/Nike-Kobe-4-Protro-Snake/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/images/Li-Ning-Way-of-Wade-12-Liberty-Black.jpg?fit=fill&bg=FFFFFF&w=700&h=500&q=90&dpr=1&trim=color",
      "https://images.stockx.com/images/Li-Ning-Way-of-Wade-12-Lux-ASG.jpg?fit=fill&bg=FFFFFF&w=700&h=500&q=90&dpr=1&trim=color",
      "https://images.stockx.com/360/Nike-Kobe-6-Protro-Sail/Images/Nike-Kobe-6-Protro-Sail/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-Kobe-4-Protro-Gold-Medal-2024/Images/Nike-Kobe-4-Protro-Gold-Medal-2024/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/images/Li-Ning-Way-of-Wade-12-Cotton-Candy.jpg?fit=fill&bg=FFFFFF&w=700&h=500&q=90&dpr=1&trim=color",
    ]
  },
  {
    rank: 6, name: "Chet Holmgren", team: "OKC", id: 1631096,
    shoe: "Nike KD 18 PE", brand: "Nike",
    shoeImgs: [
      "https://images.stockx.com/360/Nike-KD-18-Chet-Holmgren-Thunder-and-Reign/Images/Nike-KD-18-Chet-Holmgren-Thunder-and-Reign/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-KD-18-Chet-Holmgren-Thunder-and-Reign/Images/Nike-KD-18-Chet-Holmgren-Thunder-and-Reign/Lv2/img02.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-KD-18-International-Blue/Images/Nike-KD-18-International-Blue/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-KD-18-EYBL/Images/Nike-KD-18-EYBL/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-KD-18-Halloween/Images/Nike-KD-18-Halloween/Lv2/img01.jpg?w=700&q=90&h=500",
    ]
  },
  {
    rank: 7, name: "Jalen Brunson", team: "NYK", id: 1628973,
    shoe: "Nike Kobe 6 Protro", brand: "Nike",
    shoeImgs: [
      "https://images.stockx.com/360/Nike-Kobe-6-Protro-Jalen-Brunson-Statue-of-Liberty/Images/Nike-Kobe-6-Protro-Jalen-Brunson-Statue-of-Liberty/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-Kobe-6-Protro-Jalen-Brunson-Statue-of-Liberty/Images/Nike-Kobe-6-Protro-Jalen-Brunson-Statue-of-Liberty/Lv2/img02.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-Kobe-6-Protro-Grinch/Images/Nike-Kobe-6-Protro-Grinch/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-Kobe-6-Protro-Reverse-Grinch/Images/Nike-Kobe-6-Protro-Reverse-Grinch/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-Kobe-6-Protro-Sail/Images/Nike-Kobe-6-Protro-Sail/Lv2/img01.jpg?w=700&q=90&h=500",
      "https://images.stockx.com/360/Nike-Kobe-6-Protro-Mamba-Forever/Images/Nike-Kobe-6-Protro-Mamba-Forever/Lv2/img01.jpg?w=700&q=90&h=500",
    ]
  },
  {
    rank: 8, name: "Karl-Anthony Towns", team: "NYK", id: 1626157,
    shoe: "Nike GT Jump 2", brand: "Nike",
    shoeImgs: [
      "https://images.stockx.com/360/Nike-GT-Jump-2-Alpha-Wave/Images/Nike-GT-Jump-2-Alpha-Wave/Lv2/img01.jpg?w=700&q=90&dpr=2&updated_at=1701367946&h=500",
      "https://images.stockx.com/360/Nike-GT-Jump-2-Alpha-Wave/Images/Nike-GT-Jump-2-Alpha-Wave/Lv2/img02.jpg?w=700&q=90&dpr=2&updated_at=1701367946&h=500",
      "https://images.stockx.com/360/Nike-GT-Jump-2-Alpha-Wave/Images/Nike-GT-Jump-2-Alpha-Wave/Lv2/img03.jpg?w=700&q=90&dpr=2&updated_at=1701367946&h=500",
      "https://images.stockx.com/360/Nike-GT-Jump-2-Alpha-Wave/Images/Nike-GT-Jump-2-Alpha-Wave/Lv2/img04.jpg?w=700&q=90&dpr=2&updated_at=1701367946&h=500",
    ]
  },
  {
    rank: 9, name: "Donovan Mitchell", team: "CLE", id: 1628378,
    shoe: "Adidas D.O.N. Issue 7", brand: "Adidas",
    shoeImgs: [
      "https://cdn.sanity.io/images/pu5wtzfc/production/4aea49f0560c9c67e940eb577997d291d641b40d-2000x1250.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/74d393dff056312652f8cb06eea23f5e8a077fab-2000x1250.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/a8e5d37d3f925f2667795287eb0beb844126b874-2000x1250.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/ce9bd21feb23493190b8ea21df9e9c10f7af8ae8-2000x1250.jpg",
    ]
  },
  {
    rank: 10, name: "Evan Mobley", team: "CLE", id: 1630596,
    shoe: "Adidas AE 2", brand: "Adidas",
    shoeImgs: [
      "https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2025%2F09%2F11%2Fanthony-edwards-adidas-ae-2-release-date-information-1.jpg?q=90&w=800&cbr=1&fit=max",
      "https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2025%2F09%2F11%2Fanthony-edwards-adidas-ae-2-release-date-information-2.jpg?q=90&w=800&cbr=1&fit=max",
      "https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2025%2F09%2F11%2Fanthony-edwards-adidas-ae-2-release-date-information-3.jpg?q=90&w=800&cbr=1&fit=max",
      "https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2025%2F09%2F11%2Fanthony-edwards-adidas-ae-2-release-date-information-4.jpg?q=90&w=800&cbr=1&fit=max",
    ]
  },
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

const trendingEl = document.getElementById("trending-players");
if (trendingEl) {
  trendingEl.innerHTML = TRENDING_PLAYERS.map(p => {
    const brandColor = BRAND_COLORS[p.brand] || "#fd5927";
    const galleryId = `gallery-${p.rank}`;
    const thumbsHtml = p.shoeImgs.map((src, i) => `
      <img src="${src}" alt="${p.shoe} colorway ${i + 1}"
           class="gallery-thumb${i === 0 ? ' active' : ''}"
           onerror="this.style.display='none'">`
    ).join('');

    return `
      <div class="shoe-card">
        <div class="shoe-gallery" id="${galleryId}">
          <div class="gallery-badge">#${p.rank} Trending</div>
          <img class="gallery-main" src="${p.shoeImgs[0]}" alt="${p.shoe}"
               onerror="this.style.opacity='0.2'">
          <div class="gallery-thumbs">${thumbsHtml}</div>
        </div>
        <div class="shoe-card-info">
          <img src="https://cdn.nba.com/headshots/nba/latest/260x190/${p.id}.png"
               alt="${p.name}" class="player-headshot"
               onerror="this.style.opacity='0'">
          <div class="player-info">
            <div class="player-name">${p.name}
              <span class="player-team">${p.team}</span>
            </div>
            ${p.freeAgent
              ? `<div class="player-shoe"><span class="free-agent-tag">SHOE FREE AGENT</span> ${p.shoe}</div>`
              : `<div class="player-shoe"><span class="shoe-brand" style="color:${brandColor}">${p.brand}</span> ${p.shoe}</div>`
            }
          </div>
        </div>
      </div>`;
  }).join('');

  // Click thumbnails to change main image
  trendingEl.addEventListener('click', e => {
    const thumb = e.target.closest('.gallery-thumb');
    if (!thumb) return;
    const gallery = thumb.closest('.shoe-gallery');
    if (!gallery) return;
    swapGalleryImg(gallery, thumb);
  });

  // Auto-cycle each gallery every 3.5 seconds, staggered
  TRENDING_PLAYERS.forEach((p, playerIdx) => {
    if (p.shoeImgs.length <= 1) return;
    setTimeout(() => {
      setInterval(() => {
        const gallery = document.getElementById(`gallery-${p.rank}`);
        if (!gallery) return;
        const thumbs = [...gallery.querySelectorAll('.gallery-thumb')].filter(t => t.style.display !== 'none');
        if (thumbs.length < 2) return;
        const activeIdx = thumbs.findIndex(t => t.classList.contains('active'));
        const next = thumbs[(activeIdx + 1) % thumbs.length];
        swapGalleryImg(gallery, next);
      }, 3500);
    }, playerIdx * 600);
  });
}

function swapGalleryImg(gallery, thumb) {
  gallery.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
  const main = gallery.querySelector('.gallery-main');
  main.style.opacity = '0';
  setTimeout(() => {
    main.src = thumb.src;
    main.style.opacity = '1';
  }, 150);
}
