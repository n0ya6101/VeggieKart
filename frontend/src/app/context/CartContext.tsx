'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { Product, Unit, CartItem, DisplayCartItem, User } from '../types';

interface CartContextType {
  displayCart: DisplayCartItem[];
  cart: CartItem[];
  handleQuantityChange: (product: Product, unit: Unit, change: number) => void;
  getQuantityForUnit: (unitId: string) => number;
  uniqueCartItemCount: number;
  cartTotal: number;
  isCartSidebarOpen: boolean;
  toggleCartSidebar: () => void;
  clearCart: () => void;
  auth: any;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [displayCart, setDisplayCart] = useState<DisplayCartItem[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [auth, setAuth] = useState<{ token: string | null; isLoggedIn: boolean; user: User | null }>({ token: null, isLoggedIn: false, user: null });

  // Step 1: Load all initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch all products first and store them
        const productsRes = await fetch('http://localhost:5001/api/products');
        const products = await productsRes.json();
        setAllProducts(products);

        // Then, load cart and auth state
        const localCart = localStorage.getItem('veggiekart-cart');
        if (localCart) setCart(JSON.parse(localCart));
        
        const token = localStorage.getItem('veggiekart-token');
        if (token) await login(token);
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        // Only set loading to false after everything is fetched
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Step 2: Hydrate the cart ONLY when data is ready
  useEffect(() => {
    // Do not run this effect if products haven't loaded yet
    if (allProducts.length === 0) {
      setDisplayCart([]); // Ensure display cart is empty if there are no products
      return;
    }

    // Create a map for efficient lookups
    const unitMap = new Map(allProducts.flatMap(p => p.allowedUnits.map(u => [u.id, { unit: u, product: p }])));
    
    const newDisplayCart = cart.map(item => {
      const details = unitMap.get(item.unitId);
      // If a unit from the cart doesn't exist in our products (e.g., it was deleted), skip it
      if (!details) return null;
      return { ...item, product: details.product, unit: details.unit };
    }).filter((item): item is DisplayCartItem => item !== null);

    setDisplayCart(newDisplayCart);
    
    // Also, update localStorage here
    if (!isLoading) {
      localStorage.setItem('veggiekart-cart', JSON.stringify(cart));
    }
  }, [cart, allProducts, isLoading]);

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

  const toggleCartSidebar = () => setIsCartSidebarOpen(prev => !prev);
  const clearCart = () => setCart([]);

  const handleQuantityChange = (product: Product, unit: Unit, change: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.unitId === unit.id);
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
        return [...prevCart, { unitId: unit.id, quantity: 1 }];
      }
      return prevCart;
    });
  };
  
  const getQuantityForUnit = (unitId: string) => {
    return cart.find(item => item.unitId === unitId)?.quantity || 0;
  };

  const cartTotal = displayCart.reduce((total, item) => {
    const price = item.unit.discountPercentage > 0
      ? item.unit.price - (item.unit.price * (item.unit.discountPercentage / 100))
      : item.unit.price;
    return total + (price * item.quantity);
  }, 0);

  const uniqueCartItemCount = displayCart.length;

  return (
    <CartContext.Provider value={{ cart, displayCart, handleQuantityChange, getQuantityForUnit, uniqueCartItemCount, cartTotal, isCartSidebarOpen, toggleCartSidebar, auth, login, logout, isLoading, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
};