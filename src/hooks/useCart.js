import { useState, useEffect } from 'react';

// Custom event for cross-component cart updates
const CART_UPDATE_EVENT = 'cozyfits_cart_update';

export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const calculateTotal = (items) => {
    const t = items.reduce((acc, item) => acc + (item.price_pkr * item.quantity), 0);
    setTotal(t);
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem('cozyfits_cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
      calculateTotal(parsedCart);
    }
  };

  useEffect(() => {
    loadCart();
    
    const handleUpdate = () => loadCart();
    window.addEventListener(CART_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(CART_UPDATE_EVENT, handleUpdate);
  }, []);

  const addToCart = (product, size = '3Y') => {
    const savedCart = localStorage.getItem('cozyfits_cart');
    let currentCart = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItem = currentCart.find(item => item.id === product.id && item.selectedSize === size);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1, selectedSize: size });
    }
    
    localStorage.setItem('cozyfits_cart', JSON.stringify(currentCart));
    window.dispatchEvent(new Event(CART_UPDATE_EVENT));
    window.dispatchEvent(new Event('cozyfits_open_cart'));
  };

  const removeFromCart = (productId, size) => {
    const savedCart = localStorage.getItem('cozyfits_cart');
    let currentCart = savedCart ? JSON.parse(savedCart) : [];
    
    currentCart = currentCart.filter(item => !(item.id === productId && item.selectedSize === size));
    
    localStorage.setItem('cozyfits_cart', JSON.stringify(currentCart));
    window.dispatchEvent(new Event(CART_UPDATE_EVENT));
  };

  const updateQuantity = (productId, size, delta) => {
    const savedCart = localStorage.getItem('cozyfits_cart');
    let currentCart = savedCart ? JSON.parse(savedCart) : [];
    
    const item = currentCart.find(item => item.id === productId && item.selectedSize === size);
    if (item) {
      item.quantity = Math.max(1, item.quantity + delta);
      localStorage.setItem('cozyfits_cart', JSON.stringify(currentCart));
      window.dispatchEvent(new Event(CART_UPDATE_EVENT));
    }
  };

  const clearCart = () => {
    localStorage.removeItem('cozyfits_cart');
    window.dispatchEvent(new Event(CART_UPDATE_EVENT));
  };

  return { cart, total, addToCart, removeFromCart, updateQuantity, clearCart };
};
