import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QuantitySelector from '../components/QuantitySelector.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, subtotal, loading, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = useMemo(() => subtotal, [subtotal]);

  if (loading) {
    return (
      <div className="fk-container">
        <div className="fk-cart-page">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="fk-container">
      <div className="fk-cart-page">
        <div className="fk-cart-left">
          <div className="fk-cart-title">My Cart</div>

          {items.length === 0 ? (
            <div className="fk-empty">
              Your cart is empty. <Link to="/">Continue shopping</Link>
            </div>
          ) : (
            items.map((it) => (
              <div key={it.cart_item_id} className="fk-cart-item">
                <img
                  src={it.thumbnail_url}
                  alt={it.title}
                  className="fk-cart-img"
                />

                <div className="fk-cart-info">
                  <div className="fk-cart-item-title">{it.title}</div>
                  <div className="fk-cart-item-price">
                    ₹{Number(it.price).toLocaleString('en-IN')}
                  </div>
                  <div className="fk-cart-controls">
                    <QuantitySelector
                      value={Number(it.quantity)}
                      min={1}
                      max={Math.max(1, Number(it.stock))}
                      onChange={(q) => updateQuantity(it.cart_item_id, q)}
                    />

                    <button
                      className="fk-link-btn"
                      onClick={() => removeFromCart(it.cart_item_id)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="fk-cart-line-total">
                  ₹{(Number(it.price) * Number(it.quantity)).toLocaleString('en-IN')}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="fk-cart-right">
          <div className="fk-summary">
            <div className="fk-summary-title">PRICE DETAILS</div>
            <div className="fk-summary-row">
              <span>Subtotal</span>
              <span>₹{Number(subtotal).toLocaleString('en-IN')}</span>
            </div>
            <div className="fk-summary-row bold">
              <span>Total</span>
              <span>₹{Number(total).toLocaleString('en-IN')}</span>
            </div>

            <button
              className="fk-btn primary full"
              disabled={items.length === 0}
              onClick={() => navigate('/checkout')}
              type="button"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
