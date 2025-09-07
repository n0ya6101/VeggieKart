import { ProductGrid } from '@/app/components/product/ProductGrid';
import type { Product } from '@/app/types';

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch('https://vegiekart-api.onrender.com/api/products', { cache: 'no-store' });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return []; 
  }
}

export default async function Home() {
  const initialProducts = await getProducts();
  return (
    <div className="bg-white min-h-screen">
      <ProductGrid initialProducts={initialProducts} />
    </div>
  );
}