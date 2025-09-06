'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { Product, Unit, CartItem, User } from '../types';

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
  user: User | null;
}

interface CartContextType {
  cart: CartItem[];
  handleQuantityChange: (product: Product, unit: Unit, change: number) => void;
  uniqueCartItemCount: number;
  cartTotal: number;
  isCartSidebarOpen: boolean;
  toggleCartSidebar: () => void;
  clearCart: () => void;
  auth: AuthState;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
  const [auth, setAuth] = useState<AuthState>({
    token: null,
    isLoggedIn: false,
    user: null,
  });

  // Load initial state from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem('veggiekart-token');
    if (token) {
      login(token);
    }
    const localCart = localStorage.getItem('veggiekart-cart');
    if (localCart) {
      setCart(JSON.parse(localCart));
    }
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('veggiekart-cart', JSON.stringify(cart));
  }, [cart]);

  const toggleCartSidebar = () => setIsCartSidebarOpen(prev => !prev);

  const login = async (token: string) => {
    localStorage.setItem('veggiekart-token', token);
    try {
      const response = await fetch('http://localhost:5001/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch user profile');
      const userData: User = await response.json();
      setAuth({ token, isLoggedIn: true, user: userData });
    } catch (error) {
      console.error(error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('veggiekart-token');
    setAuth({ token: null, isLoggedIn: false, user: null });
  };
  
  const handleQuantityChange = (product: Product, unit: Unit, change: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.productId === product.id && item.unit.id === unit.id);
      
      if (existingItemIndex > -1) {
        const newQuantity = prevCart[existingItemIndex].quantity + change;
        if (newQuantity > product.maxOrderLimit) {
          alert(`You can only add up to ${product.maxOrderLimit} units.`);
          return prevCart;
        }
        if (newQuantity <= 0) {
          return prevCart.filter((_, index) => index !== existingItemIndex);
        }
        return prevCart.map((item, index) => 
          index === existingItemIndex ? { ...item, quantity: newQuantity } : item
        );
      } else if (change > 0) {
        return [...prevCart, { 
          productId: product.id, 
          name: product.name, 
          quantity: 1, 
          unit: unit, 
          maxOrderLimit: product.maxOrderLimit,
          imageUrl: product.imageUrl
        }];
      }
      return prevCart;
    });
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = item.unit.discountPercentage > 0
      ? item.unit.price - (item.unit.price * (item.unit.discountPercentage / 100))
      : item.unit.price;
    return total + (price * item.quantity);
  }, 0);

  const clearCart = () => setCart([]);
  const uniqueCartItemCount = cart.length;

  return (
    <CartContext.Provider value={{ cart, handleQuantityChange, uniqueCartItemCount, cartTotal, isCartSidebarOpen, toggleCartSidebar, auth, login, logout, clearCart }}>
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