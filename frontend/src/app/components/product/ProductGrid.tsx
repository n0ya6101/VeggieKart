'use client';

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import type { Product, Unit } from '../../types';
import { ProductCard } from './ProductCard';
import { Header } from '../ui/Header';
import { CartSidebar } from '../cart/CartSideBar';
import { MobileCartBar } from '../cart/MobileCartBar';
import { UnitSelectionModal } from './UnitSelectionModal';

export const ProductGrid = ({ initialProducts }: { initialProducts: Product[] }) => {
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

  const filteredProducts = initialProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const { category } = product;
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <CartSidebar /> 
      <main className="container mx-auto p-4 lg:w-[76%]">
        {Object.entries(groupedProducts).map(([category, items]) => (
          <section key={category} className="mb-10">
            <h2 id={category.toLowerCase()} className="text-2xl font-bold text-gray-900 mb-4 scroll-mt-24">{category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {items.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onAddToCart={handleAddToCartClick}
                />
              ))}
            </div>
          </section>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-900">No products found</h2>
          </div>
        )}
      </main>
      <MobileCartBar />
      
      {modalProduct && <UnitSelectionModal product={modalProduct} onClose={() => setModalProduct(null)} />}
    </>
  );
}
