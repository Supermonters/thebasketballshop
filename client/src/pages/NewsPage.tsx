import { useEffect, useState } from "react";
import { getNews } from "../api";
import type { NewsItem } from "../types";

export function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getNews()
      .then((data) => setItems(data.news))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <main className="main-content">
      <div className="fullwidth-block inner-content">
        <div className="container">
          <div className="row react-news-layout">
            <div className="col-md-7">
              <div className="content">
                <h2 className="entry-title">NBA News Updated Hourly</h2>
                {error && <p>{error}</p>}
                {items.map((item, idx) => (
                  <article className="post" key={item.link || idx}>
                    {item.image_url && <img src={item.image_url} alt={item.title || "news"} />}
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noreferrer">
                        Read more
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </div>
            <div className="col-md-4 col-md-push-1">
              <aside className="sidebar">
                <div className="widget">
                  <h3 className="widget-title">NBA Highlights</h3>
                  <ul className="discography-list">
                    {items.slice(0, 5).map((item, idx) => (
                      <li key={item.link || `side-${idx}`}>
                        <figure className="cover">
                          <img src={item.image_url || "/images/heat.jpg"} alt="thumbnail" />
                        </figure>
                        <div className="detail">
                          <h3>
                            <a href={item.link || "#"} target="_blank" rel="noreferrer">
                              {item.title}
                            </a>
                          </h3>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
