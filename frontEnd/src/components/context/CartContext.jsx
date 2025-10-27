import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [checkoutItems, setCheckoutItems] = useState(() => {
    try {
      const saved = localStorage.getItem("checkoutItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist cart & checkoutItems
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
  }, [checkoutItems]);

  // Normalize image filename
  const normalizeImage = (image) => {
    if (!image) return "";
    return image.includes("/") ? image.split("/").pop() : image;
  };

  // Add product to cart
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p._id === product._id);
      if (existing) {
        return prev.map((p) =>
          p._id === product._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [
        ...prev,
        { ...product, quantity: 1, image: normalizeImage(product.image) },
      ];
    });
  };

  const decrementQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((p) => (p._id === id ? { ...p, quantity: p.quantity - 1 } : p))
        .filter((p) => p.quantity > 0)
    );
  };


  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p._id !== id));
  };

 
  const clearCart = () => setCart([]);

  
  const placeOrder = () => {
    if (cart.length === 0) return;
    setCheckoutItems([...cart]);
  };

  const buyNow = (product) => {
    const normalized = {
      ...product,
      quantity: 1,
      image: normalizeImage(product.image),
    };
    setCheckoutItems([normalized]);
  };

  

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        decrementQuantity,
        clearCart,
        checkoutItems,
        setCheckoutItems,
        placeOrder,
        buyNow,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
