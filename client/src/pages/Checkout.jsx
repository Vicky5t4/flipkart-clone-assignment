import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiSend } from '../api/api.js';
import { useCart } from '../context/CartContext.jsx';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, refreshCart, loading } = useCart();

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [busy, setBusy] = useState(false);

  const shippingFee = useMemo(() => (subtotal >= 999 ? 0 : 50), [subtotal]);
  const total = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee]);

  function update(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function placeOrder() {
    setBusy(true);
    try {
      const result = await apiSend('/api/orders', 'POST', form);
      await refreshCart();
      navigate(`/order-success/${result.orderId}`);
    } catch (e) {
      alert(e.message || 'Failed to place order');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="fk-container">
        <div className="fk-checkout">Loading checkout...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="fk-container">
        <div className="fk-empty">Your cart is empty. Add products to checkout.</div>
      </div>
    );
  }

  return (
    <div className="fk-container">
      <div className="fk-checkout">
        <div className="fk-checkout-left">
          <div className="fk-section-title">Shipping Address</div>

          <div className="fk-form">
            <div className="fk-form-row">
              <label>Full Name</label>
              <input
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="fk-form-row">
              <label>Phone</label>
              <input
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="10-digit mobile number"
              />
            </div>

            <div className="fk-form-row">
              <label>Address Line 1</label>
              <input
                value={form.addressLine1}
                onChange={(e) => update('addressLine1', e.target.value)}
                placeholder="House no, street, area"
              />
            </div>

            <div className="fk-form-row">
              <label>Address Line 2 (optional)</label>
              <input
                value={form.addressLine2}
                onChange={(e) => update('addressLine2', e.target.value)}
                placeholder="Landmark, apartment, etc."
              />
            </div>

            <div className="fk-form-grid2">
              <div className="fk-form-row">
                <label>City</label>
                <input
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div className="fk-form-row">
                <label>State</label>
                <input
                  value={form.state}
                  onChange={(e) => update('state', e.target.value)}
                  placeholder="State"
                />
              </div>
            </div>

            <div className="fk-form-row">
              <label>Pincode</label>
              <input
                value={form.pincode}
                onChange={(e) => update('pincode', e.target.value)}
                placeholder="6-digit pincode"
              />
            </div>

            <button
              className="fk-btn primary full"
              type="button"
              onClick={placeOrder}
              disabled={busy}
            >
              {busy ? 'Placing Order...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>

        <div className="fk-checkout-right">
          <div className="fk-summary">
            <div className="fk-summary-title">Order Summary</div>

            <div className="fk-mini-items">
              {items.map((it) => (
                <div key={it.cart_item_id} className="fk-mini-item">
                  <span className="fk-mini-title">{it.title}</span>
                  <span className="fk-mini-qty">x{it.quantity}</span>
                </div>
              ))}
            </div>

            <div className="fk-summary-row">
              <span>Subtotal</span>
              <span>₹{Number(subtotal).toLocaleString('en-IN')}</span>
            </div>
            <div className="fk-summary-row">
              <span>Delivery Fee</span>
              <span>₹{Number(shippingFee).toLocaleString('en-IN')}</span>
            </div>
            <div className="fk-summary-row bold">
              <span>Total</span>
              <span>₹{Number(total).toLocaleString('en-IN')}</span>
            </div>

            <div className="fk-note">
              Note: This assignment assumes a default logged-in user.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
