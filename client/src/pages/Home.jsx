import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiGet } from '../api/api.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const search = params.get('search') || '';
  const category = params.get('category') || 'all';

  useEffect(() => {
    (async () => {
      try {
        const cats = await apiGet('/api/categories');
        setCategories(cats);
      } catch (e) {
        // Non-blocking
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const q = new URLSearchParams();
        if (search) q.set('search', search);
        if (category && category !== 'all') q.set('category', category);

        const data = await apiGet(`/api/products?${q.toString()}`);
        setProducts(data);
      } catch (e) {
        setError(e.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    })();
  }, [search, category]);

  function setCategory(slug) {
    const q = new URLSearchParams(location.search);
    if (!slug || slug === 'all') q.delete('category');
    else q.set('category', slug);
    navigate(`/?${q.toString()}`);
  }

  return (
    <div className="fk-container">
      <div className="fk-home">
        <aside className="fk-sidebar">
          <div className="fk-sidebar-title">Filters</div>

          <div className="fk-filter-block">
            <div className="fk-filter-label">Category</div>
            <button
              className={`fk-filter-item ${category === 'all' ? 'active' : ''}`}
              onClick={() => setCategory('all')}
              type="button"
            >
              All
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                className={`fk-filter-item ${category === c.slug ? 'active' : ''}`}
                onClick={() => setCategory(c.slug)}
                type="button"
              >
                {c.name}
              </button>
            ))}
          </div>
        </aside>

        <main className="fk-main">
          <div className="fk-results-head">
            <div className="fk-results-title">
              {search ? (
                <>
                  Results for <span>"{search}"</span>
                </>
              ) : (
                <>Best Deals</>
              )}
            </div>

            <div className="fk-results-count">
              {loading ? 'Loading...' : `${products.length} products`}
            </div>
          </div>

          {error ? <div className="fk-error">{error}</div> : null}

          <div className="fk-grid">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="fk-card fk-card-skeleton" />
                ))
              : products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </main>
      </div>
    </div>
  );
}
