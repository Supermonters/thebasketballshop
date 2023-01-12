(async () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let arr;
  let d = new Date();
  d.setTime(Date.now());
  if (localStorage.getItem("news") === null || JSON.parse(localStorage.getItem("news")).date !== `${d.getUTCDate().toString()}${d.getUTCMonth().toString()}${d.getUTCFullYear().toString()}`) {
    let a = await fetch(
      "https://newsdata.io/api/1/news?apikey=pub_1550576968a334f90cbb606bd4690ca338b1e&q=nba&language=en&category=sports"
    );
    let data = await a.json();
    arr = data.results.filter((el) => (el.image_url !== null && el.description !== null));
    localStorage.setItem("news", JSON.stringify({
      date: `${d.getUTCDate().toString()}${d.getUTCMonth().toString()}${d.getUTCFullYear().toString()}`,
      arr: arr
    }));
  } else {
    arr = JSON.parse(localStorage.getItem("news")).arr;
  }
  for (let i = 0; i < arr.length; i++) {
    d.setTime(Date.parse(arr[i].pubDate));
    let html = `
    <div class="post">
    <div class="entry-date">
        <div class="date">${d.getDate()}</div>
        <span class="month">${months[d.getMonth()]}</span>
    </div>
    <div class="featured-image">
        <img src="${arr[i].image_url}"
            alt="${arr[i].title}">
    </div>
    <h2 class="entry-title">
        <a href="${arr[i].link}">${arr[i].title}</a>
    </h2>
    <h3>${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}</h3>
    <p>${arr[i].description}</p>
    <a href="${arr[i].link}">Đọc thêm</a>
    </div>`;
    document.body.getElementsByClassName("content")[0].innerHTML += html;
  }
})();
