'use client';

import { useCart } from '../CartContext';

export const MobileCartBar = () => {
  const { cart, cartItemCount, cartTotal, toggleCartSidebar } = useCart();

  if (cartItemCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-green-600 text-white p-3 shadow-xl z-30 md:hidden rounded-xl backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-sm">
              {cart.length} Item{cart.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs font-extrabold">₹{cartTotal.toFixed(2)}</p>
          </div>
        </div>
        
        <button 
          onClick={toggleCartSidebar} 
          className="font-bold text-sm flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Open cart"
        >
          <span>View Cart</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};