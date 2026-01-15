import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiGet } from '../api/api.js';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await apiGet(`/api/orders/${orderId}`);
        setData(res);
      } catch (e) {
        setError(e.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (loading) {
    return (
      <div className="fk-container">
        <div className="fk-success">Loading order confirmation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fk-container">
        <div className="fk-error">{error}</div>
      </div>
    );
  }

  const order = data?.order;
  const items = data?.items || [];

  return (
    <div className="fk-container">
      <div className="fk-success">
        <div className="fk-success-card">
          <div className="fk-success-title">✅ Order Placed Successfully</div>
          <div className="fk-success-id">
            Order ID: <span>#{orderId}</span>
          </div>

          <div className="fk-success-meta">
            <div>
              <strong>Total Paid:</strong> ₹{Number(order.total).toLocaleString('en-IN')}
            </div>
            <div>
              <strong>Status:</strong> {order.status}
            </div>
          </div>

          <div className="fk-section-title" style={{ marginTop: 16 }}>
            Items
          </div>
          <div className="fk-mini-items">
            {items.map((it, idx) => (
              <div key={idx} className="fk-mini-item">
                <span className="fk-mini-title">{it.title_snapshot}</span>
                <span className="fk-mini-qty">x{it.quantity}</span>
              </div>
            ))}
          </div>

          <div className="fk-success-actions">
            <Link to="/" className="fk-btn primary">
              Continue Shopping
            </Link>
            <Link to="/cart" className="fk-btn light">
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
