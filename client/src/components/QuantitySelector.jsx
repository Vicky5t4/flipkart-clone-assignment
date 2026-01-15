import React from 'react';

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  function dec() {
    onChange(Math.max(min, value - 1));
  }

  function inc() {
    onChange(Math.min(max, value + 1));
  }

  return (
    <div className="fk-qty">
      <button type="button" onClick={dec} className="fk-qty-btn">
        -
      </button>
      <div className="fk-qty-value">{value}</div>
      <button type="button" onClick={inc} className="fk-qty-btn">
        +
      </button>
    </div>
  );
}
