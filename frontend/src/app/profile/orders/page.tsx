import { Header } from '@/app/components/ui/Header';

export default function MyOrdersPage() {
  return (
    <div>
      <Header />
      <main className="container mx-auto p-10">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="mt-4 text-gray-600">Your order history will appear here.</p>
      </main>
    </div>
  );
}