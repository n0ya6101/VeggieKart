import { Header } from '@/app/components/ui/Header';

export default function MyAddressesPage() {
  return (
    <div>
      <Header />
      <main className="container mx-auto p-10">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <p className="mt-4 text-gray-600">Your saved addresses will appear here.</p>
      </main>
    </div>
  );
}