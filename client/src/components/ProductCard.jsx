import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="fk-card">
      <div className="fk-card-imgwrap">
        <img
          src={product.thumbnail_url}
          alt={product.title}
          loading="lazy"
        />
      </div>
      <div className="fk-card-body">
        <div className="fk-card-title" title={product.title}>
          {product.title}
        </div>
        <div className="fk-card-price">₹{Number(product.price).toLocaleString('en-IN')}</div>
        <div className="fk-card-meta">
          {product.stock > 0 ? (
            <span className="fk-instock">In Stock</span>
          ) : (
            <span className="fk-outstock">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}
