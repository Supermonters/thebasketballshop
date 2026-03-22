import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api";
import type { Product } from "../types";

type FilterKey = "all" | "concert" | "band" | "stuff";

export function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.products))
      .catch((err: Error) => setError(err.message));
  }, []);

  const filteredProducts =
    activeFilter === "all"
      ? products
      : products.filter((item) => item.filter === activeFilter);

  return (
    <main className="main-content react-store-page">
      <div className="fullwidth-block gallery">
        <div className="container">
          <div className="content fullwidth">
            <h2 className="entry-title react-store-title">Cửa hàng</h2>
            <div className="filter-links filterable-nav react-store-filters">
              <button
                type="button"
                className={`react-filter-chip ${activeFilter === "all" ? "current" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                Tất cả
              </button>
              <button
                type="button"
                className={`react-filter-chip ${activeFilter === "concert" ? "current" : ""}`}
                onClick={() => setActiveFilter("concert")}
              >
                Nike
              </button>
              <button
                type="button"
                className={`react-filter-chip ${activeFilter === "band" ? "current" : ""}`}
                onClick={() => setActiveFilter("band")}
              >
                Hãng khác
              </button>
              <button
                type="button"
                className={`react-filter-chip ${activeFilter === "stuff" ? "current" : ""}`}
                onClick={() => setActiveFilter("stuff")}
              >
                Phụ kiện
              </button>
            </div>
            {error && <p>{error}</p>}
            <div className="filterable-items react-store-grid">
              {filteredProducts.map((item) => (
                <div className={`filterable-item ${item.filter} react-store-card`} key={item.id}>
                  <Link to={`/product/${item.id}`} className="react-store-card-link">
                    <figure className="react-store-card-figure">
                      <img
                        src={item.mouseout || item.cartpic}
                        alt={item.alt}
                        onMouseOver={(e) => {
                          e.currentTarget.src = item.mouseover || item.mouseout || item.cartpic;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.src = item.mouseout || item.cartpic;
                        }}
                      />
                    </figure>
                  </Link>
                  <h3 className="react-store-item-title">{item.name}</h3>
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
