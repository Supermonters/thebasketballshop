const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ── News articles (left column) ──────────────────────────────
(async () => {
  try {
    const arr = (await (await fetch("/news")).json()).news;
    const content = document.body.getElementsByClassName("content")[0];
    const d = new Date();
    for (const item of arr) {
      d.setTime(Date.parse(item.pubDate.replace(" ", "T") + "Z"));
      content.innerHTML += `
      <div class="post">
        <div class="entry-date">
          <div class="date">${d.getDate()}</div>
          <span class="month">${months[d.getMonth()]}</span>
        </div>
        <div class="featured-image">
          <img src="${item.image_url}" alt="${item.title}">
        </div>
        <h2 class="entry-title" style="margin-bottom:0">
          <a href="${item.link}">${item.title}</a>
        </h2>
        <h3 style="margin-top:0">${("0"+d.getHours()).slice(-2)}:${("0"+d.getMinutes()).slice(-2)}</h3>
        <p>${item.description}</p>
        <a href="${item.link}">Read more</a>
      </div>`;
    }
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
