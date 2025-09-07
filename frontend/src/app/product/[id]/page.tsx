
import { Header } from '@/app/components/ui/Header';
import { ProductDetailClient } from '@/app/components/product/ProductDetailClient';
import { CartSidebar } from '@/app/components/cart/CartSideBar'; 
import { MobileCartBar } from '@/app/components/cart/MobileCartBar'; 
import type { Product } from '@/app/types';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`https://vegiekart-api.onrender.com/api/products/${id}`, { cache: 'no-store' });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div>
        <Header />
        <main className="container mx-auto p-10 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <CartSidebar />
      <MobileCartBar />
      <ProductDetailClient product={product} />
    </div>
  );
}
