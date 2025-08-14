// src/app/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useCart } from '../CartContext';

interface HeaderProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

export const Header = ({ searchTerm, setSearchTerm }: HeaderProps) => {
  const { cart, isLoggedIn, toggleLogin, cartTotal, toggleCartSidebar } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors">
          VeggieKart
        </Link>
        
        {/* Search Bar */}
        {setSearchTerm && (
          <div className="hidden md:block w-1/2 lg:w-1/3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search for products..."
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white shadow-sm text-black transition-all"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Right side buttons */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={toggleLogin} 
            className="font-semibold text-gray-800 hover:text-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded px-2 py-1"
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
          
          {/* Cart Button */}
          <button 
            onClick={toggleCartSidebar} 
            className="hidden md:flex bg-green-600 text-white px-4 py-2 rounded-lg items-center space-x-2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <span className="text-sm font-bold">{cart.length} Item{cart.length !== 1 ? 's' : ''}</span>
              <p className="text-xs">₹{cartTotal.toFixed(2)}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {setSearchTerm && (
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for products..."
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white shadow-sm text-black transition-all"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};