'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/app/components/ui/Header';
import { useCart } from '@/app/context/CartContext';
import type { Order } from '@/app/types';
import Link from 'next/link';

export default function MyOrdersPage() {
  const { auth } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth.token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch('https://vegiekart-api.onrender.com/api/orders', {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch orders.');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [auth.token]);

  return (
    <div>
      <Header />
      <main className="container mx-auto p-10">
        <h1 className="text-2xl font-bold">My Orders</h1>
        {isLoading ? (
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        ) : error ? (
          <p className="mt-4 text-red-600">{error}</p>
        ) : orders.length === 0 ? (
          <p className="mt-4 text-gray-600">You have not placed any orders yet.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <Link key={order.id} href={`/profile/orders/${order.id}`} className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-md font-semibold text-gray-800">Order ID: {order.id}</h2>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{order.totalAmount.toFixed(2)}</p>
                    <p className={`text-sm font-semibold capitalize ${order.status === 'CONFIRMED' ? 'text-green-600' : 'text-gray-600'}`}>
                      {order.status.toLowerCase()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}