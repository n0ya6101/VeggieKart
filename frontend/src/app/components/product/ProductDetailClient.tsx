'use client';

import { useCart } from '../../context/CartContext';
import type { Product, Unit } from '../../types';

export const ProductDetailClient = ({ product }: { product: Product }) => {
  const { cart, handleQuantityChange } = useCart();
  const desc = product.description; 

  return (
    <main className="container mx-auto p-4 lg:w-[76%]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4">
          <div className="w-full h-80 bg-gray-100 flex items-center justify-center rounded-lg">
            <span className="text-gray-800">{product.name} Image</span>
          </div>
        </div>
        <div className="p-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          
          <div className="mt-6">
            {product.allowedUnits.map(unit => {
              const cartItem = cart.find(item => item.productId === product.id && item.unit.id === unit.id);
              const discountedPrice = unit.discountPercentage > 0 
                ? unit.price - (unit.price * (unit.discountPercentage / 100)) 
                : unit.price;

              return (
                <div key={unit.id} className="flex justify-between items-center p-4 border text-gray-900 rounded-lg mb-3">
                  <div>
                    <p className="font-semibold">{unit.name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xl font-bold">₹{discountedPrice.toFixed(0)}</p>
                      {unit.discountPercentage > 0 && <p className="text-md text-gray-800 line-through">₹{unit.price}</p>}
                    </div>
                  </div>
                  {cartItem ? (
                    <div className="flex items-center border border-green-600 rounded-md">
                      <button onClick={() => handleQuantityChange(product, unit, -1)} className="px-4 py-2 text-green-600 font-bold text-xl">-</button>
                      <span className="px-4 py-2 text-md font-bold">{cartItem.quantity}</span>
                      <button onClick={() => handleQuantityChange(product, unit, 1)} className="px-4 py-2 text-green-600 font-bold text-xl">+</button>
                    </div>
                  ) : (
                    <button onClick={() => handleQuantityChange(product, unit, 1)} className="border border-green-600 text-green-600 font-bold py-2 px-8 rounded-md hover:bg-green-600 hover:text-white transition-colors">
                      ADD
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {desc && (
        <div className="mt-8 p-4">
          <h2 className="font-bold text-xl mb-4">Product Details</h2>
          <div className="space-y-3 text-gray-800 text-sm">
            {desc.details && <p>{desc.details}</p>}
            {desc.healthBenefits && <p><strong>Health Benefits:</strong> {desc.healthBenefits}</p>}
            {desc.shelfLife && <p><strong>Shelf Life:</strong> {desc.shelfLife}</p>}
            {desc.countryOfOrigin && <p><strong>Country of Origin:</strong> {desc.countryOfOrigin}</p>}
            {desc.seller && <p><strong>Seller:</strong> {desc.seller}</p>}
          </div>
        </div>
      )}
    </main>
  );
};
