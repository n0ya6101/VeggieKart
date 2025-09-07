'use client';

import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import type { Product, Unit } from '../../types';

export const ProductCard = ({ 
  product, 
  onAddToCart 
}: { 
  product: Product; 
  onAddToCart: (product: Product, unit: Unit) => void;
}) => {
  const { handleQuantityChange, getQuantityForUnit } = useCart();
  const defaultUnit = product.allowedUnits[0];
  
  const hasMultipleUnits = product.allowedUnits.length > 1;
  const quantityInCart = getQuantityForUnit(defaultUnit.id);

  const discountedPrice = defaultUnit.discountPercentage > 0
    ? defaultUnit.price - (defaultUnit.price * (defaultUnit.discountPercentage / 100))
    : defaultUnit.price;

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <div className="bg-white rounded-lg border border-gray-200 flex flex-col group h-full overflow-hidden">
        <div className="relative">
          {/* Discount Badge */}
          <div className="absolute top-2 left-2 z-10">
            {defaultUnit.discountPercentage > 0 && <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">{defaultUnit.discountPercentage}% OFF</div>}
          </div>

          {/* ** NEW FEATURE: Quantity Badge ** */}
          {quantityInCart > 0 && (
            <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center z-10">
              {quantityInCart}
            </div>
          )}

          <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-800 text-xs">{product.name}</span>
          </div>
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <h2 className="text-sm font-medium text-gray-900 flex-grow leading-tight mb-2">{product.name}</h2>
          <p className="text-xs text-gray-800 mb-2">{defaultUnit.name}</p>
          <div className="flex justify-between items-center mt-auto pt-2">
            <div>
              <p className="text-base font-bold text-gray-900">₹{discountedPrice.toFixed(0)}</p>
              {defaultUnit.discountPercentage > 0 && <p className="text-xs text-gray-800 line-through">₹{defaultUnit.price}</p>}
            </div>
            
            <div className="w-1/2 max-w-[100px] flex justify-end">
              {!hasMultipleUnits && quantityInCart > 0 ? (
                 <div className="flex items-center border border-green-600 rounded-md">
                    <button onClick={(e) => { e.preventDefault(); handleQuantityChange(product, defaultUnit, -1); }} className="px-3 py-1 text-green-600 font-bold text-lg">-</button>
                    <span className="px-3 py-1 text-sm font-bold text-gray-900">{quantityInCart}</span>
                    <button onClick={(e) => { e.preventDefault(); handleQuantityChange(product, defaultUnit, 1); }} className="px-3 py-1 text-green-600 font-bold text-lg">+</button>
                  </div>
              ) : (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart(product, defaultUnit);
                  }} 
                  className="border border-green-600 text-green-600 font-bold py-2 px-6 text-xs rounded-md hover:bg-green-600 hover:text-white transition-colors"
                >
                  ADD
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
