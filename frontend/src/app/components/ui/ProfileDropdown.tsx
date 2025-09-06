'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth, logout } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!auth.isLoggedIn) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-10 w-10 bg-gray-200 rounded-full text-gray-600 font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {auth.user?.phone?.charAt(0).toUpperCase() || 'U'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 py-2">
          <div className="px-4 py-2 border-b">
            <p className="font-semibold text-gray-800 text-sm">Hello!</p>
            <p className="text-gray-600 text-xs truncate">{auth.user?.phone}</p>
          </div>
          <Link href="/profile/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link>
          <Link href="/profile/addresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Addresses</Link>
          <div className="border-t my-2"></div>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
