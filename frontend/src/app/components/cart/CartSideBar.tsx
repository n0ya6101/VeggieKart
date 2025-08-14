// src/app/components/cart/CartSidebar.tsx
'use client';

import { useEffect } from 'react';
import { useCart } from '../CartContext';
import { ProductImage } from '../ui/ProductImage';
import type { CartItem, Product } from '../CartContext';

// Utility function to create a minimal Product object from CartItem
const createProductFromCartItem = (item: CartItem): Product => ({
  _id: item.productId,
  name: item.name,
  maxOrderLimit: item.maxOrderLimit,
  category: '',
  allowedUnits: [item.unit],
});

export const CartSidebar = () => {
  const { 
    cart, 
    handleQuantityChange, 
    cartTotal, 
    isLoggedIn, 
    toggleLogin, 
    isCartSidebarOpen, 
    toggleCartSidebar 
  } = useCart();
  
  const deliveryFee = 29;
  const total = cartTotal + deliveryFee;

  // Handle body scroll when sidebar is open
  useEffect(() => {
    if (isCartSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartSidebarOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isCartSidebarOpen) {
        toggleCartSidebar();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isCartSidebarOpen, toggleCartSidebar]);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isCartSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCartSidebar}
        aria-hidden={!isCartSidebarOpen}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white text-gray-800 shadow-xl z-50 transform transition-transform duration-300 ${
          isCartSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        aria-hidden={!isCartSidebarOpen}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h2 id="cart-title" className="text-xl font-bold text-gray-900">
              My Cart ({cart.length})
            </h2>
            <button 
              onClick={toggleCartSidebar} 
              className="text-2xl p-2 hover:bg-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Close cart"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          
          {/* Cart Items */}
          <div className="flex-grow overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-medium">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-1">Add some fresh groceries to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => {
                  const hasDiscount = item.unit.discountPercentage && item.unit.discountPercentage > 0;
                  const discountedPrice = hasDiscount 
                    ? item.unit.price - (item.unit.price * (item.unit.discountPercentage! / 100)) 
                    : item.unit.price;
                  const product = createProductFromCartItem(item);
                  
                  return (
                    <article 
                      key={`${item.productId}-${item.unit.name}`} 
                      className="flex items-center bg-gray-50 rounded-lg p-3"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 mr-4 flex-shrink-0">
                        <ProductImage
                          src={undefined} // You might want to pass the image URL from the cart item
                          alt={`${item.name} in cart`}
                          className="w-full h-full rounded-md"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-grow min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-xs text-gray-600 mb-1">{item.unit.name}</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-bold text-gray-900">
                            ₹{(discountedPrice * item.quantity).toFixed(2)}
                          </p>
                          {hasDiscount && (
                            <p className="text-xs text-gray-500 line-through">
                              ₹{(item.unit.price * item.quantity).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div 
                        className="flex items-center border border-green-600 rounded-md ml-3"
                        role="group"
                        aria-label={`Quantity controls for ${item.name}`}
                      >
                        <button 
                          onClick={() => handleQuantityChange(product, item.unit, -1)} 
                          className="px-3 py-1 font-bold text-green-600 hover:bg-green-50 transition-colors focus:outline-none focus:ring-1 focus:ring-green-500"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>
                        <span 
                          className="px-3 py-1 text-sm font-bold text-gray-900 min-w-[2rem] text-center"
                          aria-label={`Current quantity: ${item.quantity}`}
                        >
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(product, item.unit, 1)} 
                          className="px-3 py-1 font-bold text-green-600 hover:bg-green-50 transition-colors focus:outline-none focus:ring-1 focus:ring-green-500"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t bg-gray-50 p-4 space-y-3">
              {/* Price Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={!isLoggedIn ? toggleLogin : () => alert('Proceeding to checkout!')}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                {isLoggedIn ? 'Proceed to Checkout' : 'Login to Proceed'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};