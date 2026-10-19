import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({
    mrpTotal: 0,
    subtotal: 0,
    discountOnMrp: 0,
    shipping: 0,
    total: 0
  });
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setItemCount(0);
      setSummary({ mrpTotal: 0, subtotal: 0, discountOnMrp: 0, shipping: 0, total: 0 });
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data.success) {
        setItems(res.data.data.items || []);
        setItemCount(res.data.data.itemCount || 0);
        setSummary(res.data.data.summary || {});
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, size, color, quantity = 1) => {
    if (!isAuthenticated) {
      addToast('Please sign in to add items to your cart.', 'info');
      return false;
    }

    try {
      const res = await api.post('/cart', { product_id: productId, size, color, quantity });
      if (res.data.success) {
        addToast('Added to cart!', 'success');
        await fetchCart();
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not add to cart.';
      addToast(msg, 'error');
      return false;
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      const res = await api.put(`/cart/${cartItemId}`, { quantity: newQuantity });
      if (res.data.success) {
        await fetchCart();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not update quantity.';
      addToast(msg, 'error');
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const res = await api.delete(`/cart/${cartItemId}`);
      if (res.data.success) {
        addToast('Item removed from cart.', 'info');
        await fetchCart();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not remove item.';
      addToast(msg, 'error');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setItems([]);
      setItemCount(0);
      setSummary({ mrpTotal: 0, subtotal: 0, discountOnMrp: 0, shipping: 0, total: 0 });
      setAppliedCoupon(null);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        summary,
        loading,
        appliedCoupon,
        setAppliedCoupon,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
