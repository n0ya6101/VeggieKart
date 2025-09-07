'use client';

import { useCart } from '../../context/CartContext';
import type { Product } from '../../types';

interface UnitSelectionModalProps {
  product: Product;
  onClose: () => void;
}

export const UnitSelectionModal = ({ product, onClose }: UnitSelectionModalProps) => {
  const { handleQuantityChange, getQuantityForUnit } = useCart();

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
          <button onClick={onClose} className="text-2xl text-gray-800">&times;</button>
        </div>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {product.allowedUnits.map((unit) => {
            const hasDiscount = unit.discountPercentage > 0;
            const discountedPrice = hasDiscount
              ? unit.price - (unit.price * (unit.discountPercentage / 100))
              : unit.price;
            const quantityInCart = getQuantityForUnit(unit.id);

            return (
              <div key={unit.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{unit.name}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-base font-bold text-gray-900">₹{discountedPrice.toFixed(0)}</p>
                    {hasDiscount && <p className="text-xs text-gray-800 line-through">₹{unit.price}</p>}
                  </div>
                </div>
                {quantityInCart > 0 ? (
                  <div className="flex items-center border border-green-600 rounded-md">
                    <button onClick={() => handleQuantityChange(product, unit, -1)} className="px-3 py-1 text-green-600 font-bold text-lg">-</button>
                    <span className="px-3 py-1 text-sm font-bold text-gray-900">{quantityInCart}</span>
                    <button onClick={() => handleQuantityChange(product, unit, 1)} className="px-3 py-1 text-green-600 font-bold text-lg">+</button>
                  </div>
                ) : (
                  <button onClick={() => handleQuantityChange(product, unit, 1)} className="border border-green-600 text-green-600 font-bold py-1 px-5 text-sm rounded-md hover:bg-green-600 hover:text-white transition-colors">ADD</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};