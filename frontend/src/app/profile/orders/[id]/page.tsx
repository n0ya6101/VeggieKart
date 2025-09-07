'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/app/components/ui/Header';
import { useCart } from '@/app/context/CartContext';
import type { Order } from '@/app/types'; // We'll update this type

export default function OrderDetailPage() {
  const { auth } = useCart();
  const params = useParams();
  const { id } = params;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.token || !id) return;

    const fetchOrderDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://vegiekart-api.onrender.com/api/orders/${id}`, {
          headers: { 'Authorization': `Bearer ${auth.token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order details.');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [auth.token, id]);

  if (isLoading) {
    return (
        <div>
            <Header />
            <main className="container mx-auto p-10"><p>Loading order details...</p></main>
        </div>
    );
  }

  if (error) {
    return (
        <div>
            <Header />
            <main className="container mx-auto p-10"><p className="text-red-500">{error}</p></main>
        </div>
    );
  }

  if (!order) {
    return (
        <div>
            <Header />
            <main className="container mx-auto p-10"><p>Order not found.</p></main>
        </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto p-10">
        <Link href="/profile/orders" className="text-green-600 hover:underline text-sm">&larr; Back to all orders</Link>
        <div className="mt-4 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold">Order Details</h1>
                    <p className="text-sm text-gray-500 mt-1">Order ID: {order.id}</p>
                    <p className="text-sm text-gray-500">
                        Placed on: {new Date(order.createdAt).toLocaleString('en-IN')}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold">₹{order.totalAmount.toFixed(2)}</p>
                    <p className={`text-sm font-semibold capitalize ${order.status === 'CONFIRMED' ? 'text-green-600' : 'text-gray-600'}`}>
                        {order.status.toLowerCase()}
                    </p>
                </div>
            </div>
            <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold mb-2 text-lg">Items Ordered</h3>
                <ul className="space-y-3">
                    {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center text-sm">
                        <div>
                            <p className="font-semibold">{item.product.name}</p>
                            <p className="text-gray-500">{item.unit.name}</p>
                        </div>
                        <div className="text-right">
                            <p>{item.quantity} x ₹{item.priceAtPurchase.toFixed(2)}</p>
                            <p className="font-bold">₹{(item.quantity * item.priceAtPurchase).toFixed(2)}</p>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
            {order.shippingAddress && (
                <div className="mt-6 border-t pt-4">
                    <h3 className="font-semibold mb-2 text-lg">Shipping Address</h3>
                    <div className="text-sm text-gray-600">
                        <p>{order.shippingAddress.addressLine}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}