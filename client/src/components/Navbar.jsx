import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [term, setTerm] = useState('');

  useEffect(() => {
    // Keep search box in sync with URL query
    const params = new URLSearchParams(location.search);
    setTerm(params.get('search') || '');
  }, [location.search]);

  function onSubmit(e) {
    e.preventDefault();
    const search = term.trim();
    navigate(`/?search=${encodeURIComponent(search)}`);
  }

  return (
    <header className="fk-header">
      <div className="fk-header-inner">
        <div className="fk-left">
          <Link to="/" className="fk-logo">
            <div className="fk-logo-main">Flipkart</div>
            <div className="fk-logo-sub">
              Explore <span>Plus</span>
            </div>
          </Link>

          <form className="fk-search" onSubmit={onSubmit}>
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search for products, brands and more"
              aria-label="Search"
            />
            <button type="submit" className="fk-search-btn">
              🔍
            </button>
          </form>
        </div>

        <nav className="fk-right">
          <Link to="/cart" className="fk-cart">
            🛒 Cart
            {cartCount > 0 ? <span className="fk-badge">{cartCount}</span> : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
