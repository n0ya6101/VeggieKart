// src/app/page.tsx
import { ProductGrid } from './components';
import type { Product } from './components';

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch('http://localhost:5000/api/products', {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn('Products endpoint not found');
        return [];
      }
      if (response.status >= 500) {
        console.error('Server error:', response.status);
        return [];
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const { products, pagination } = await response.json();
    
    // Validate data structure
    if (!Array.isArray(products)) {
      console.error('Invalid data format received');
      return [];
    }
    
    return products;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error("Network error - API server might be down:", error);
    } else {
      console.error("Failed to fetch products:", error);
    }
    return []; 
  }
}

export default async function Home() {
  const initialProducts = await getProducts();

  if (!initialProducts || initialProducts.length === 0) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17H13V18H12V17M12,6H13V16H12V6Z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Unable to load products
          </h2>
          <p className="text-gray-600 mb-4">
            Please check your connection and try again.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white min-h-screen">
      <ProductGrid initialProducts={initialProducts} />
    </div>
  );
}