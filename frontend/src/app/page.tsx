import { Header, ProductGrid } from './components/ClientComponents';
import type { Product } from './components/CartContext';

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch('http://localhost:5000/api/products', {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data: Product[] = await response.json();
    return data;
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