import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('shaya_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [customCartItems, setCustomCartItems] = useState(() => {
    const saved = localStorage.getItem('shaya_custom_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shaya_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('shaya_custom_cart', JSON.stringify(customCartItems));
  }, [customCartItems]);

  // Add Ready-Made Product to Cart
  const addToCart = (product, size = 'M', color = 'White', quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product === product._id && item.size === size && item.color === color
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity,
          size,
          color,
          image: product.image,
        },
      ];
    });
  };

  // Add Custom Tailored Item to Cart
  const addCustomToCart = (customDesign) => {
    setCustomCartItems((prev) => [...prev, customDesign]);
  };

  // Remove Ready-Made Item
  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove Custom Item
  const removeCustomFromCart = (index) => {
    setCustomCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Update Ready-Made Item Quantity
  const updateQuantity = (index, delta) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) return prev.filter((_, i) => i !== index);
      updated[index].quantity = newQty;
      return updated;
    });
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
    setCustomCartItems([]);
    localStorage.removeItem('shaya_cart');
    localStorage.removeItem('shaya_custom_cart');
  };

  // Total items count
  const cartCount =
    cartItems.reduce((sum, item) => sum + item.quantity, 0) + customCartItems.length;

  // Subtotal calculation
  const subtotal =
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
    customCartItems.reduce((sum, item) => sum + item.customPrice, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        customCartItems,
        cartCount,
        subtotal,
        addToCart,
        addCustomToCart,
        removeFromCart,
        removeCustomFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
