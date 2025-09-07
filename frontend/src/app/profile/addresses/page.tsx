'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/app/components/ui/Header';
import { useCart } from '@/app/context/CartContext';
import type { Address } from '@/app/types';
import { AddAddressForm } from '@/app/components/ui/AddAddressForm';

export default function MyAddressesPage() {
  const { auth } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

const fetchAddresses = async () => {
    if (!auth.token) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch('https://vegiekart-api.onrender.com/api/addresses', {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch addresses.');
      }
      const data = await response.json();
      setAddresses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [auth.token]);
  
  const handleAddressAdded = (newAddress: Address) => {
    fetchAddresses();
    setShowAddAddressForm(false);
  };

  // ** NEW FUNCTION **
  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }
    
    try {
      const response = await fetch(`https://vegiekart-api.onrender.com/api/addresses/${addressId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${auth.token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete address.');
      }
      
      // Refetch addresses to update the UI
      fetchAddresses();

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto p-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Addresses</h1>
          <button
            onClick={() => setShowAddAddressForm(!showAddAddressForm)}
            className="text-sm font-semibold text-green-600 hover:text-green-800"
          >
            {showAddAddressForm ? 'Cancel' : '+ Add New Address'}
          </button>
        </div>
        {showAddAddressForm && (
            <div className="mt-4">
            <AddAddressForm onAddressAdded={handleAddressAdded} onCancel={() => setShowAddAddressForm(false)} />
            </div>
        )}

        {isLoading ? (
          <p className="mt-4 text-gray-600">Loading your addresses...</p>
        ) : error ? (
          <p className="mt-4 text-red-600">{error}</p>
        ) : addresses.length === 0 ? (
          <p className="mt-4 text-gray-600">You have not saved any addresses yet.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div key={address.id} className="bg-white p-6 rounded-lg shadow relative">
                <div className="pr-10">
                    <p className="font-semibold">{address.addressLine}</p>
                    <p className="text-sm text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
                    {address.isDefault && (
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full mt-2 inline-block">
                        DEFAULT
                    </span>
                    )}
                </div>
                {/* ** NEW FEATURE ** */}
                <button 
                  onClick={() => handleDeleteAddress(address.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-600"
                  aria-label="Delete address"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}