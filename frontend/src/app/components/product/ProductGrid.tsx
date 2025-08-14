// src/app/components/product/ProductGrid.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../CartContext';
import { Header } from '../layout/Header';
import { CartSidebar } from '../cart/CartSideBar';
import { MobileCartBar } from '../cart/MobileCartBar';
import { UnitSelectionModal } from '../cart/UnitSelectionModal';
import { ProductCard } from './ProductCard';
import type { Product, Unit } from '../CartContext';

interface ProductGridProps {
  initialProducts: Product[];
}

export const ProductGrid = ({ initialProducts }: ProductGridProps) => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  
  const { handleQuantityChange } = useCart();

  const handleAddToCartClick = (product: Product, unit: Unit) => {
    if (product.allowedUnits.length > 1) {
      setModalProduct(product);
    } else {
      handleQuantityChange(product, unit, 1);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const { category } = product;
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const categoryCount = Object.keys(groupedProducts).length;

  return (
    <>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <CartSidebar /> 
      
      <main className="container mx-auto p-4 lg:w-[76%] min-h-screen">
        {/* Search Results Info */}
        {searchTerm && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800">
              {filteredProducts.length > 0 
                ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} for "${searchTerm}"`
                : `No products found for "${searchTerm}"`
              }
            </p>
            {searchTerm && filteredProducts.length === 0 && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-2 text-sm text-green-600 hover:text-green-800 underline"
              >
                Clear search and view all products
              </button>
            )}
          </div>
        )}

        {/* Product Display Logic */}
        {categoryCount > 0 && categoryCount < 3 ? (
          // Grid Layout for 1-2 categories
          <section className="mb-10">
            {Object.entries(groupedProducts).map(([category]) => (
              <div key={category} className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                  <span className="text-sm text-gray-500">
                    {groupedProducts[category].length} product{groupedProducts[category].length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredProducts.map((product) => (
                <div key={product._id} className="w-full">
                  <Link href={`/product/${product._id}`} className="block h-full">
                    <ProductCard 
                      product={product} 
                      onAddToCart={(e, product, unit) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCartClick(product, unit);
                      }}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ) : (
          // Scrollable Layout for 3+ categories
          <div className="space-y-10">
            {Object.entries(groupedProducts).map(([category, items]) => (
              <section key={category} className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                  <span className="text-sm text-gray-500">
                    {items.length} product{items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {items.map((product) => (
                    <div key={product._id} className="flex-shrink-0 w-40">
                      <Link href={`/product/${product._id}`} className="block h-full">
                        <ProductCard 
                          product={product} 
                          onAddToCart={(e, product, unit) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCartClick(product, unit);
                          }}
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* No products found message */}
        {filteredProducts.length === 0 && !searchTerm && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No products available</h2>
            <p className="text-gray-600">Check back later for fresh groceries!</p>
          </div>
        )}

        {/* Loading state could go here */}
        {products.length === 0 && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading fresh groceries...</p>
          </div>
        )}
      </main>

      <MobileCartBar />
      {modalProduct && (
        <UnitSelectionModal 
          product={modalProduct} 
          onClose={() => setModalProduct(null)} 
        />
      )}
    </>
  );
};