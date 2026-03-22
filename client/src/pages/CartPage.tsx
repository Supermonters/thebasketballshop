import { useMemo, useState } from "react";
import { getCart, parsePrice, removeFromCart, saveCart } from "../cart";

export function CartPage() {
  const [items, setItems] = useState(getCart());
  const total = useMemo(
    () => items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0),
    [items]
  );

  function updateQuantity(index: number, qty: number) {
    const next = [...items];
    next[index].quantity = Math.max(1, qty);
    setItems(next);
    saveCart(next);
  }

  function removeAll() {
    saveCart([]);
    setItems([]);
  }

  function purchase() {
    saveCart([]);
    setItems([]);
    window.alert("Purchase successful");
  }

  return (
    <main className="main-content react-cart-page">
      <section className="container content-section">
        <h2 className="section-header react-cart-title">CART</h2>
        <div className="cart-row react-cart-header-row">
          <span className="cart-item cart-header cart-column">ITEM</span>
          <span className="cart-price cart-header cart-column">PRICE</span>
          <span className="cart-quantity cart-header cart-column">QUANTITY</span>
        </div>
        <div className="cart-items react-cart-panel">
          {items.length === 0 && (
            <h2 id="nothingInTheCart" className="react-empty-cart">
              Your cart is empty
            </h2>
          )}
          {items.map((item, index) => (
            <div className="cart-row" key={`${item.id}-${item.option}`}>
              <div className="cart-item cart-column">
                <img className="cart-item-image" src={item.cartpic} alt={item.name} />
                <span className="cart-item-title">{item.name}</span>
              </div>
              <span className="cart-price cart-column">{item.price}</span>
              <div className="cart-quantity cart-column">
                <input
                  className="cart-quantity-input"
                  type="number"
                  title="Quantity"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(index, Number(e.target.value))}
                />
                <button
                  className="btn-danger1 react-remove-btn"
                  onClick={() => {
                    removeFromCart(item.id, item.option);
                    setItems(getCart());
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <strong className="cart-total-title">Total</strong>
            <span className="cart-total-price">{total.toLocaleString("en-US")} VND</span>
          </div>
          <div className="react-cart-actions">
            <button className="btn-purchase button-30 react-remove-all-btn" onClick={removeAll}>
              Remove All
            </button>
            <button className="btn-purchase button-30 react-buy-btn" onClick={purchase}>
              Buy now
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
