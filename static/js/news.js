const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PAGE_SIZE = 10;
let allArticles = [];
let shown = 0;

function articleHTML(item) {
  const d = new Date();
  d.setTime(Date.parse(item.pubDate.replace(" ", "T") + "Z"));
  return `
  <div class="post">
    <div class="entry-date">
      <div class="date">${d.getDate()}</div>
      <span class="month">${months[d.getMonth()]}</span>
    </div>
    <div class="featured-image">
      <a href="${item.link}" target="_blank" rel="noopener">
        <img src="${item.image_url}" alt="${item.title}">
      </a>
    </div>
    <h2 class="entry-title" style="margin-bottom:0">
      <a href="${item.link}" target="_blank" rel="noopener">${item.title}</a>
    </h2>
    <h3 style="margin-top:0">${("0"+d.getHours()).slice(-2)}:${("0"+d.getMinutes()).slice(-2)}</h3>
    <p>${item.description ? (item.description.length > 160 ? item.description.slice(0, 160) + '…' : item.description) : ''}</p>
    <a href="${item.link}" target="_blank" rel="noopener">Read more</a>
  </div>`;
}

function renderBatch() {
  const content = document.body.getElementsByClassName("content")[0];
  const btn = document.getElementById("load-more-btn");
  const batch = allArticles.slice(shown, shown + PAGE_SIZE);

  // Insert articles before the button
  batch.forEach(item => {
    if (btn) {
      btn.insertAdjacentHTML("beforebegin", articleHTML(item));
    } else {
      content.innerHTML += articleHTML(item);
    }
  });

  shown += batch.length;

  // Hide button when all articles shown
  if (btn) {
    btn.style.display = shown >= allArticles.length ? "none" : "block";
  }
}

// ── News articles (left column) ──────────────────────────────
(async () => {
  try {
    allArticles = (await (await fetch("/news")).json()).news;
    const content = document.body.getElementsByClassName("content")[0];

    // Append the load-more button placeholder into the content div
    content.insertAdjacentHTML("beforeend", `
      <button id="load-more-btn" class="load-more-btn">Load more</button>
    `);

    renderBatch();

    document.getElementById("load-more-btn").addEventListener("click", renderBatch);
  } catch (e) {
    console.error("Failed to load news articles", e);
  }
})();

// ── NBA Headline story cards (right sidebar) ─────────────────
(async () => {
  const grid = document.getElementById("story-grid");
  if (!grid) return;

  try {
    const { stories } = await (await fetch("/nba-stories")).json();
    if (!stories || stories.length === 0) {
      grid.innerHTML = '<p style="color:#848484;font-size:0.875rem;">No stories available.</p>';
      return;
    }

    grid.innerHTML = stories.map(s => `
      <a href="${s.url}" target="_blank" rel="noopener" class="story-card">
        <div class="story-thumb" style="background-image:url('${s.thumbnail}')">
          <div class="story-overlay">
            ${s.isLive ? '<span class="story-live">LIVE</span>' : `<span class="story-time">${s.timestamp}</span>`}
            <h4 class="story-title">${s.title}</h4>
          </div>
        </div>
      </a>
    `).join("");
  } catch (e) {
    console.error("Failed to load NBA stories", e);
    grid.innerHTML = '<p style="color:#848484;font-size:0.875rem;">Could not load headlines.</p>';
  }
})();
