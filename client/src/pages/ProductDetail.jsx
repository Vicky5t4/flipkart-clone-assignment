import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiGet } from '../api/api.js';
import ImageCarousel from '../components/ImageCarousel.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiGet(`/api/products/${id}`);
        setProduct(data);
      } catch (e) {
        setError(e.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleAdd() {
    if (!product) return;
    setBusy(true);
    try {
      await addToCart(product.id, 1);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleBuyNow() {
    await handleAdd();
    navigate('/checkout');
  }

  if (loading) {
    return (
      <div className="fk-container">
        <div className="fk-detail loading">Loading product...</div>
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

  if (!product) return null;

  return (
    <div className="fk-container">
      <div className="fk-detail">
        <div className="fk-detail-left">
          <ImageCarousel images={product.images} />
        </div>

        <div className="fk-detail-right">
          <div className="fk-detail-title">{product.title}</div>
          <div className="fk-detail-category">{product.category_name}</div>

          <div className="fk-detail-price">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </div>

          <div className="fk-detail-stock">
            {product.stock > 0 ? (
              <span className="fk-instock">In Stock</span>
            ) : (
              <span className="fk-outstock">Out of Stock</span>
            )}
          </div>

          <div className="fk-detail-actions">
            <button
              className="fk-btn primary"
              onClick={handleAdd}
              disabled={busy || product.stock <= 0}
            >
              ADD TO CART
            </button>
            <button
              className="fk-btn accent"
              onClick={handleBuyNow}
              disabled={busy || product.stock <= 0}
            >
              BUY NOW
            </button>
          </div>

          <div className="fk-detail-desc">
            <div className="fk-section-title">Description</div>
            <div className="fk-text">{product.description}</div>
          </div>

          <div className="fk-detail-specs">
            <div className="fk-section-title">Specifications</div>
            <div className="fk-spec-grid">
              {product.specs?.map((s, i) => (
                <div key={i} className="fk-spec-row">
                  <div className="fk-spec-key">{s.spec_key}</div>
                  <div className="fk-spec-val">{s.spec_value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
