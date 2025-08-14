import { Header} from '../../components/layout/Header';
import { ProductDetailClient } from '../../components/product/ProductDetailClient';
import type { Product } from '../../components/CartContext';

// --- SERVER-SIDE DATA FETCHING for a single product ---
async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`http://localhost:5000/api/products/${id}`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

// --- PRODUCT DETAIL PAGE (SERVER COMPONENT) ---
export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <div>
        <Header searchTerm="" setSearchTerm={() => {}} />
        <main className="container mx-auto p-10 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Header  />
      <ProductDetailClient product={product} />
    </div>
  );
}
