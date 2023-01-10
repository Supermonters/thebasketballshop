(async () => {
  let a = await fetch(
    "https://newsdata.io/api/1/news?apikey=pub_1550576968a334f90cbb606bd4690ca338b1e&q=nba&language=en&category=sports "
  );
  let data = await a.json();
  let arr = data.results.filter((el) => el.image_url !== null);
  console.log(arr.length);
  for (let i = 0; i < arr.length; i++) {
    let html = `
    <div class="post">
    <div class="entry-date">
        <div class="date">18</div>
        <span class="month">Sep</span>
    </div>
    <div class="featured-image">
        <img src="${arr[i].image_url}"
            alt="${arr[i].title}">
    </div>
    <h2 class="entry-title"><a
            href="${arr[i].link}">${arr[i].title}</a></h2>
    <p>${arr[i].description}</p>
    <a
        href="${arr[i].link}">Đọc
        thêm</a>
</div>`;
    document.body.getElementsByClassName("content")[0].innerHTML += html;
  }
})();
