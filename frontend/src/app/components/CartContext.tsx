'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export interface Unit {
  name: string;
  price: number;
  discountPercentage?: number;
}
export interface Description {
  unit?: string;
  details?: string;
  healthBenefits?: string;
  serveSize?: string;
  shelfLife?: string;
  returnPolicy?: string;
  countryOfOrigin?: string;
  seller?: string;
  sellerFSSAI?: string;
  foodAdditivesInfo?: string;
  disclaimer?: string;
  customerCareDetails?: {
    email?: string;
  };
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  allowedUnits: Unit[];
  maxOrderLimit: number;
  imageUrl?: string;
  description?: Description; 
}

export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  unit: Unit;
  maxOrderLimit: number;
}

interface CartContextType {
  cart: CartItem[];
  handleQuantityChange: (product: Product, unit: Unit, change: number) => void;
  cartItemCount: number;
  cartTotal: number;
  isLoggedIn: boolean; 
  toggleLogin: () => void; 
  isCartSidebarOpen: boolean; 
  toggleCartSidebar: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      const localCart = localStorage.getItem('veggiekart-cart');
      if (localCart) {
        setCart(JSON.parse(localCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('veggiekart-cart', JSON.stringify(cart));
    }
  }, [cart, isLoggedIn]);

  const toggleCartSidebar = () => {
    setIsCartSidebarOpen(prev => !prev);
  };

  const toggleLogin = () => {
    setIsLoggedIn(prev => !prev);
    alert(isLoggedIn ? "You have been logged out." : "You are now logged in!");
  };

  const handleQuantityChange = (product: Product, unit: Unit, change: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.productId === product._id && item.unit.name === unit.name);
      if (existingItemIndex > -1) {
        const newQuantity = prevCart[existingItemIndex].quantity + change;
        if (newQuantity > product.maxOrderLimit) {
          alert(`You can only add up to ${product.maxOrderLimit} units of ${product.name}.`);
          return prevCart;
        }
        if (newQuantity <= 0) {
          return prevCart.filter((_, index) => index !== existingItemIndex);
        } else {
          return prevCart.map((item, index) => index === existingItemIndex ? { ...item, quantity: newQuantity } : item);
        }
      } else if (change > 0) {
        return [...prevCart, { productId: product._id, name: product.name, quantity: 1, unit: unit, maxOrderLimit: product.maxOrderLimit }];
      }
      return prevCart;
    });
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = item.unit.discountPercentage ? item.unit.price - (item.unit.price * (item.unit.discountPercentage / 100)) : item.unit.price;
    return total + (price * item.quantity);
  }, 0);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

   return (
    <CartContext.Provider value={{ 
      cart, 
      handleQuantityChange, 
      cartItemCount, 
      cartTotal, 
      isLoggedIn, 
      toggleLogin,
      isCartSidebarOpen,     
      toggleCartSidebar       
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
