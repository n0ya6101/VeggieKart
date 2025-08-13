'use client';

import { useState, useEffect } from 'react';

interface Unit {
  name: string;
  price: number;
  discountPercentage?: number; // Optional discount field
}

interface Product {
  _id: string;
  name: string;
  category: string;
  allowedUnits: Unit[];
  maxOrderLimit: number;
  imageUrl?: string;
}

interface CartItem {
  _id: string;
  name: string;
  quantity: number;
  unit: Unit;
}

const Header = () => (
  <header className="bg-white shadow-sm sticky top-0 z-20">
    <div className="container mx-auto p-4 flex justify-between items-center">
      {/* Logo */}
      <a href="/" className="text-2xl font-bold text-green-600">
        VeggieKart
      </a>
      
      {/* Search Bar */}
      <div className="hidden md:block w-1/2 lg:w-1/3">
        <input 
          type="text" 
          placeholder="Search for products..."
          className="w-full px-4 py-2 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
        />
      </div>

      {/* Login Button */}
      <button className="font-semibold text-gray-700 hover:text-green-600 transition-colors">
        Login
      </button>
    </div>
  </header>
);

const ProductCard = ({ 
  product, 
  onQuantityChange,
  cartItem
}: { 
  product: Product; 
  onQuantityChange: (product: Product, unit: Unit, change: number) => void;
  cartItem?: CartItem;
}) => {
  
  const defaultUnit = product.allowedUnits[0];
  const hasDiscount = defaultUnit.discountPercentage && defaultUnit.discountPercentage > 0;
  const discountedPrice = hasDiscount 
    ? defaultUnit.price - (defaultUnit.price * (defaultUnit.discountPercentage! / 100))
    : defaultUnit.price;

  return (
    <div className="bg-white rounded-lg border border-gray-200 flex flex-col group relative p-3 h-full">
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
          {defaultUnit.discountPercentage}% OFF
        </div>
      )}

      {/* Product Image Placeholder */}
      <div className="w-full h-36 bg-gray-100 flex items-center justify-center rounded-md mb-3">
        <span className="text-gray-400 text-xs">{product.name}</span>
      </div>
      
      {/* Product Details */}
      <div className="flex flex-col flex-grow">
        <h2 className="text-sm font-medium text-gray-800 flex-grow leading-tight mb-2">
          {product.name}
        </h2>
        <p className="text-xs text-gray-500 mb-2">{defaultUnit.name}</p>
        
        <div className="flex justify-between items-center mt-auto pt-2">
          {/* Price Display */}
          <div>
            <p className="text-base font-bold text-gray-900">
              ₹{discountedPrice.toFixed(0)}
            </p>
            {hasDiscount && (
              <p className="text-xs text-gray-500 line-through">
                ₹{defaultUnit.price}
              </p>
            )}
          </div>

          {/* Add to Cart Button / Quantity Stepper */}
          {cartItem && cartItem.quantity > 0 ? (
             <div className="flex items-center border border-green-600 rounded-md">
                <button onClick={() => onQuantityChange(product, defaultUnit, -1)} className="px-2 py-0.5 text-green-600 font-bold text-lg">-</button>
                <span className="px-2 py-0.5 text-xs font-bold">{cartItem.quantity}</span>
                <button onClick={() => onQuantityChange(product, defaultUnit, 1)} className="px-2 py-0.5 text-green-600 font-bold text-lg">+</button>
             </div>
          ) : (
            <button 
              onClick={() => onQuantityChange(product, defaultUnit, 1)}
              className="border border-green-600 text-green-600 font-bold py-1 px-4 text-xs rounded-md hover:bg-green-600 hover:text-white transition-colors"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (product: Product, unit: Unit, change: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item._id === product._id);
      const newCart = [...prevCart];

      if (existingItemIndex > -1) {
        const newQuantity = newCart[existingItemIndex].quantity + change;
        if (newQuantity > product.maxOrderLimit) {
          alert(`You can only add up to ${product.maxOrderLimit} units of ${product.name}.`);
          return prevCart;
        }
        if (newQuantity <= 0) {
          newCart.splice(existingItemIndex, 1);
        } else {
          newCart[existingItemIndex].quantity = newQuantity;
        }
      } else if (change > 0) {
        newCart.push({ _id: product._id, name: product.name, quantity: 1, unit: unit });
      }
      return newCart;
    });
  };

  const groupedProducts = products.reduce((acc, product) => {
    const { category } = product;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const cartTotal = cart.reduce((total, item) => {
    const price = item.unit.discountPercentage 
      ? item.unit.price - (item.unit.price * (item.unit.discountPercentage / 100))
      : item.unit.price;
    return total + (price * item.quantity);
  }, 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (isLoading) return <div className="text-center p-10">Loading...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white min-h-screen">
      <Header />
      {/* Main content area */}
      <main className="container mx-auto p-4 pb-24 lg:w-[76%]">
        {Object.entries(groupedProducts).map(([category, items]) => (
          <section key={category} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{category}</h2>
            {/* Horizontally Scrollable Container */}
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {items.map((product) => (
                // Wrapper to control card width
                <div key={product._id} className="flex-shrink-0 w-40">
                  <ProductCard 
                    product={product} 
                    onQuantityChange={handleQuantityChange}
                    cartItem={cart.find(item => item._id === product._id)}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Persistent Cart Summary Bar */}
      {cartItemCount > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-green-600 text-white">
          {/* Centered content within the footer */}
          <div className="container mx-auto p-4 flex justify-between items-center lg:w-[76%]">
            <div>
              <p className="font-bold">{cartItemCount} Item{cartItemCount > 1 ? 's' : ''}</p>
              <p className="text-lg font-extrabold">₹{cartTotal.toFixed(2)}</p>
            </div>
            <button className="font-bold text-lg">
              View Cart →
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
