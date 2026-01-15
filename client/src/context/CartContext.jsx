import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiGet, apiSend } from '../api/api.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);

  async function refreshCart() {
    setLoading(true);
    try {
      const data = await apiGet('/api/cart');
      setItems(data.items || []);
      setSubtotal(data.subtotal || 0);
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(productId, quantity = 1) {
    await apiSend('/api/cart', 'POST', { productId, quantity });
    await refreshCart();
  }

  async function updateQuantity(cartItemId, quantity) {
    await apiSend(`/api/cart/${cartItemId}`, 'PATCH', { quantity });
    await refreshCart();
  }

  async function removeFromCart(cartItemId) {
    await apiSend(`/api/cart/${cartItemId}`, 'DELETE');
    await refreshCart();
  }

  useEffect(() => {
    refreshCart();
  }, []);

  const cartCount = useMemo(
    () => items.reduce((sum, it) => sum + Number(it.quantity), 0),
    [items]
  );

  const value = {
    items,
    subtotal,
    cartCount,
    loading,
    refreshCart,
    addToCart,
    updateQuantity,
    removeFromCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
