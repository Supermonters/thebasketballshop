import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api";
import type { Product } from "../types";

export function TrendsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((data) => setProducts(data.products.slice(0, 6)));
  }, []);

  return (
    <main className="main-content react-trends-page">
      <div className="fullwidth-block gallery">
        <div className="container">
          <div className="content fullwidth">
            <h2 className="entry-title">Trends</h2>
            <div className="filterable-items react-product-grid">
              {products.map((item) => (
                <div className="filterable-item react-trend-card" key={item.id}>
                  <figure className="react-trend-figure">
                    <img src={item.mouseout || item.cartpic} alt={item.alt || item.name} />
                  </figure>
                  <h3 className="react-trend-title">{item.name}</h3>
                  <Link className="button-30 react-link-btn" to={`/product/${item.id}`}>
                    View details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
