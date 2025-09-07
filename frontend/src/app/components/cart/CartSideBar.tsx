'use client';

import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import type { Product, DisplayCartItem } from '../../types';

export const CartSidebar = () => {
  const { displayCart, handleQuantityChange, cartTotal, auth, isCartSidebarOpen, toggleCartSidebar, isLoading } = useCart();
  const router = useRouter();

  const handleProceed = () => {
    toggleCartSidebar();
    if (!auth.isLoggedIn) {
      router.push('/login');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <>
      <div 
 
        className={`fixed inset-0  backdrop-blur-md bg-white/30 z-40 transition-opacity duration-300 ${isCartSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleCartSidebar}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white text-gray-800 shadow-xl z-50 transform transition-transform duration-300 ${isCartSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">My Cart ({displayCart.length})</h2>
            <button onClick={toggleCartSidebar} className="text-2xl">&times;</button>
          </div>
          
          {isLoading ? (
            <div className="flex-grow flex items-center justify-center">
              <p>Loading Cart...</p>
            </div>
          ) : displayCart.length > 0 ? (
            <>
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {displayCart.map((item: DisplayCartItem) => {
                   const discountedPrice = item.unit.discountPercentage > 0 
                     ? item.unit.price - (item.unit.price * (item.unit.discountPercentage / 100)) 
                     : item.unit.price;
                   
                   return (
                     <div key={item.unitId} className="flex items-center">
                       <div className="w-16 h-16 bg-gray-100 rounded-md mr-4 flex-shrink-0"></div>
                       <div className="flex-grow">
                         <p className="text-sm font-semibold">{item.product.name}</p>
                         <p className="text-xs text-gray-500">{item.unit.name}</p>
                         <p className="text-sm font-bold mt-1">₹{(discountedPrice * item.quantity).toFixed(2)}</p>
                       </div>
                       <div className="flex items-center border border-green-600 rounded-md">
                         <button onClick={() => handleQuantityChange(item.product, item.unit, -1)} className="px-3 py-1 font-bold">-</button>
                         <span className="px-3 py-1 text-sm font-bold">{item.quantity}</span>
                         <button onClick={() => handleQuantityChange(item.product, item.unit, 1)} className="px-3 py-1 font-bold">+</button>
                       </div>
                     </div>
                   );
                })}
              </div>
              <div className="p-4 border-t">
                <button 
                  onClick={handleProceed}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 px-4 transition-colors flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm">{displayCart.length} Item{displayCart.length !== 1 ? 's' : ''}</p>
                    <p className="font-extrabold">₹{cartTotal.toFixed(2)}</p>
                  </div>
                  <span className="text-lg font-bold">
                    {auth.isLoggedIn ? 'Proceed to Checkout' : 'Login to Proceed'} &rarr;
                  </span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
              <h3 className="text-lg font-semibold text-gray-800">Your cart is empty</h3>
              <p className="text-sm text-gray-500 mt-2">Add items to get started!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};