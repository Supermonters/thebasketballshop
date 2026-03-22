import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../api";
import type { Product } from "../types";
import { addToCart } from "../cart";

export function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [option, setOption] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getProduct(Number(id))
      .then((data) => {
        setProduct(data.product);
        setOption(data.product.options[0] || "Default");
      })
      .catch((err: Error) => setError(err.message));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <main className="main-content react-product-page">
      <div className="header react-product-banner">
        <img id="kd14banner" src={product.banner} alt={product.alt} />
      </div>
      <div className="tab-content react-product-content">
        <h1 className="react-product-title">{product.name}</h1>
        {product.images.map((img) => (
          <p key={img} className="react-image-wrap">
            <img className="react-product-image" src={img} alt={product.alt} />
          </p>
        ))}
      </div>
      <div className="pc_toolbar_top active react-toolbar">
        <div className="container" id="navbar">
          <div className="pro-info">
            <div className="product-name">
              {product.name}
              <select
                title="Product option"
                value={option}
                onChange={(e) => setOption(e.target.value)}
                id="optionThing"
              >
                {product.options.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>
            <div className="addcart-price">
              <div className="price">
                Total cost
                <div className="price-number1">{product.price}</div>
              </div>
              <div className="add-cart-buttons">
                <button
                  className="btn-add-cart btn-add-cart-2"
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      option,
                      price: product.price,
                      cartpic: product.cartpic,
                    })
                  }
                >
                  + Buy now
                </button>
                <a href="/cart" className="btn-add-cart react-cart-btn">
                  Cart
                </a>
              </div>
            </div>
          </div>
          <span>
            <a href="/store" className="react-back-link">
              &larr; Back to store
            </a>
          </span>
        </div>
      </div>
    </main>
  );
}
