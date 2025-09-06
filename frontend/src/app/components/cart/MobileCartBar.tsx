'use client';

import { useCart } from '../../context/CartContext';

export const MobileCartBar = () => {
  const { uniqueCartItemCount, cartTotal, toggleCartSidebar } = useCart();

  if (uniqueCartItemCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-green-600 text-white p-2 shadow-xl z-30 md:hidden rounded-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <p className="font-bold text-xs">{uniqueCartItemCount} Item{uniqueCartItemCount !== 1 ? 's' : ''}</p>
          <p className="text-sm font-extrabold">₹{cartTotal.toFixed(2)}</p>
        </div>
        <button onClick={toggleCartSidebar} className="font-bold text-sm flex items-center">
          View Cart 
          <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
