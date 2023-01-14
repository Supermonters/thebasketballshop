(async () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let arr = (await (await fetch("/news")).json()).news;
  let d = new Date();
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
    <h2 class="entry-title" style="margin-bottom:0">
        <a href="${arr[i].link}">${arr[i].title}</a>
    </h2>
    <h3 style="margin-top:0">${("0" + d.getHours()).slice(-2)}:${(
        "0" + d.getMinutes()
      ).slice(-2)}</h3>
    <p>${arr[i].description}</p>
    <a href="${arr[i].link}">Đọc thêm</a>
    </div>`;
    document.body.getElementsByClassName("content")[0].innerHTML += html;
  }
})();
