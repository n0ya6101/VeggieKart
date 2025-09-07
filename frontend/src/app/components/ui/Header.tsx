'use client';

import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { ProfileDropdown } from './ProfileDropdown';

export const Header = ({ searchTerm, setSearchTerm }: { searchTerm?: string; setSearchTerm?: (term: string) => void; }) => {
  // isLoading is destructured but not used here, which is fine.
  // The important part is that cartTotal and uniqueCartItemCount are now always defined numbers.
  const { auth, uniqueCartItemCount, cartTotal, toggleCartSidebar } = useCart();
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="container mx-auto p-4 flex justify-between items-center lg:w-[76%]">
        <Link href="/" className="text-2xl font-bold text-green-600">VeggieKart</Link>
        
        {setSearchTerm && (
          <div className="hidden md:block w-1/2 lg:w-1/3">
            <input 
              type="text" 
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm text-black"
            />
          </div>
        )}

        <div className="flex items-center space-x-6">
          {auth.isLoggedIn ? (
            <ProfileDropdown />
          ) : (
            <Link href="/login" className="font-semibold text-gray-800 hover:text-green-600 transition-colors">
              Login
            </Link>
          )}

          <button onClick={toggleCartSidebar} className="hidden md:flex bg-green-600 text-white px-4 py-2 rounded-lg items-center space-x-2 hover:bg-green-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <span className="text-sm font-bold">{uniqueCartItemCount} Item{uniqueCartItemCount !== 1 ? 's' : ''}</span>
              {/* This will now work without crashing */}
              <p className="text-xs">₹{cartTotal.toFixed(2)}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};