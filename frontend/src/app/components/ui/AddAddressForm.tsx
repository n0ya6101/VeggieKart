'use client';

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import type { Address } from '../../types';

const SERVICEABLE_PINCODES = [
  "400001", "400002", "400003", "400004", "400005", 
  "400006", "400007", "400008", "400009", "400010"
];

interface AddAddressFormProps {
  onAddressAdded: (newAddress: Address) => void;
  onCancel: () => void;
}

export const AddAddressForm = ({ onAddressAdded, onCancel }: AddAddressFormProps) => {
  const [addressLine, setAddressLine] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!SERVICEABLE_PINCODES.includes(pincode)) {
      setError(`Sorry, we currently are only servicing in region of Sambhaji Nagar. We are expanding soon!`);
      return; 
    }
    setIsLoading(true);

    try {
      const response = await fetch('https://vegiekart-api.onrender.com/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        // The body no longer includes the "state" field
        body: JSON.stringify({ addressLine, pincode, city, isDefault }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add address.');
      }

      onAddressAdded(data);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4 border-t pt-4">
      <h3 className="text-lg font-semibold">Add a new address</h3>
      <div>
        <label htmlFor="addressLine" className="block text-sm font-medium text-gray-700">Address Line</label>
        <input type="text" id="addressLine" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
          <input type="text" id="pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
          <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
        </div>
      </div>
       <div className="flex items-center">
        <input id="isDefault" type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">Set as default address</label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex items-center space-x-4">
        <button type="submit" disabled={isLoading} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400">
          {isLoading ? 'Saving...' : 'Save Address'}
        </button>
        <button type="button" onClick={onCancel} className="text-sm font-semibold text-gray-600 hover:text-gray-800">Cancel</button>
      </div>
    </form>
  );
};