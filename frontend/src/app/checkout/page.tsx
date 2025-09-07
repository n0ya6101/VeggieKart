'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { Header } from '../components/ui/Header';
import { AddAddressForm } from '../components/ui/AddAddressForm';
import type { Address } from '../types';

export default function CheckoutPage() {
  const { displayCart, cartTotal, auth, clearCart, isLoading, cart } = useCart();
  const router = useRouter();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!auth.token) return;
    try {
      const response = await fetch('https://vegiekart-api.onrender.com/api/addresses', {
          headers: { 'Authorization': `Bearer ${auth.token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch addresses.');
      
      const data: Address[] = await response.json();
      setAddresses(data);
      
      if (data.length > 0 && !selectedAddressId) {
        const defaultAddress = data.find(addr => addr.isDefault) || data[0];
        setSelectedAddressId(defaultAddress.id);
      }
    } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("An unknown error occurred.");
    }
  }, [auth.token, selectedAddressId]);

  useEffect(() => {
    if (isLoading) return;

    if (!auth.isLoggedIn) {
      router.push('/login');
      return;
    }
    if (cart.length === 0) {
      router.push('/');
      return;
    }
    fetchAddresses();
  }, [auth.isLoggedIn, auth.token, cart.length, router, isLoading, fetchAddresses]);
  
  const handleAddressAdded = () => {
    fetchAddresses();
    setShowAddAddressForm(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select a delivery address.');
      return;
    }
    setIsPlacingOrder(true);
    setError(null);
    
    try {
        const response = await fetch('https://vegiekart-api.onrender.com/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` },
            body: JSON.stringify({ cart: cart, shippingAddressId: selectedAddressId })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to place order.');

        alert('Order placed successfully!');
        clearCart();
        router.push('/orders');
    } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("An unknown error occurred.");
    } finally {
        setIsPlacingOrder(false);
    }
  };
  
  if (isLoading || !auth.isLoggedIn) {
    return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>;
  }





  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto p-4 lg:w-3/5 my-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            
            <div className="bg-white p-6 text-gray-900 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Delivery Address</h2>
                {!showAddAddressForm && (
                  <button onClick={() => setShowAddAddressForm(true)} className="text-sm font-semibold text-green-600 hover:text-green-800">+ Add New Address</button>
                )}
              </div>
              
              {!showAddAddressForm ? (
                <div className="space-y-3 mt-4">
                  {addresses.map(address => (
                    <div key={address.id} onClick={() => setSelectedAddressId(address.id)} className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAddressId === address.id ? 'bg-green-50 border-green-400 ring-2 ring-green-200' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <p className="font-semibold text-gray-800">{address.addressLine}</p>
                      <p className="text-sm text-gray-800">{`${address.city}, ${address.state} - ${address.pincode}`}</p>
                      {address.isDefault && <span className="text-xs font-bold text-green-700">DEFAULT</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <AddAddressForm onAddressAdded={handleAddressAdded} onCancel={() => setShowAddAddressForm(false)} />
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {displayCart.map(item => {
                  const discountedPrice = item.unit.discountPercentage > 0 
                    ? item.unit.price - (item.unit.price * (item.unit.discountPercentage / 100)) 
                    : item.unit.price;
                  return (
                    <div key={item.unitId} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-semibold text-gray-800">{item.product.name}</p>
                        <p className="text-gray-800">{item.quantity} x ₹{discountedPrice.toFixed(2)} ({item.unit.name})</p>
                      </div>
                      <p className="font-semibold text-gray-800">₹{(item.quantity * discountedPrice).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Delivery Fee</span><span>₹29.00</span></div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2 text-gray-900"><span>Total</span><span>₹{(cartTotal + 29).toFixed(2)}</span></div>
            </div>
             {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || !selectedAddressId || displayCart.length === 0}
              className="w-full bg-green-600 text-white font-bold py-3 mt-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}