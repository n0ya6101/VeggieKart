// src/app/components/cart/UnitSelectionModal.tsx
'use client';

import { useEffect } from 'react';
import { useCart } from '../CartContext';
import type { Product } from '../CartContext';

interface UnitSelectionModalProps {
  product: Product;
  onClose: () => void;
}

export const UnitSelectionModal = ({ product, onClose }: UnitSelectionModalProps) => {
  const { cart, handleQuantityChange } = useCart();

  // Handle escape key and prevent body scroll
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-sm mx-4 max-h-[80vh] overflow-hidden shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="p-5 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 id="modal-title" className="text-xl font-bold text-gray-900">
              {product.name}
            </h2>
            <button 
              onClick={onClose} 
              className="text-2xl text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Close modal"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Choose your preferred size</p>
        </div>

        {/* Unit Options */}
        <div className="p-5 space-y-3 max-h-60 overflow-y-auto">
          {product.allowedUnits.map((unit) => {
            const hasDiscount = unit.discountPercentage && unit.discountPercentage > 0;
            const discountedPrice = hasDiscount 
              ? unit.price - (unit.price * (unit.discountPercentage! / 100)) 
              : unit.price;
            const cartItem = cart.find(item => 
              item.productId === product._id && item.unit.name === unit.name
            );

            return (
              <div 
                key={unit.name} 
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50/50 transition-colors"
              >
                <div className="flex-grow">
                  <p className="font-semibold text-gray-900">{unit.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{discountedPrice.toFixed(0)}
                    </p>
                    {hasDiscount && (
                      <>
                        <p className="text-sm text-gray-500 line-through">
                          ₹{unit.price}
                        </p>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                          {unit.discountPercentage}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Add/Update Controls */}
                <div className="ml-4">
                  {cartItem && cartItem.quantity > 0 ? (
                    <div 
                      className="flex items-center border border-green-600 rounded-md"
                      role="group"
                      aria-label={`Quantity controls for ${unit.name}`}
                    >
                      <button 
                        onClick={() => handleQuantityChange(product, unit, -1)} 
                        className="px-3 py-1.5 text-green-600 font-bold text-lg hover:bg-green-50 transition-colors focus:outline-none focus:ring-1 focus:ring-green-500"
                        aria-label={`Decrease ${unit.name} quantity`}
                      >
                        -
                      </button>
                      <span 
                        className="px-4 py-1.5 text-sm font-bold text-gray-900 min-w-[2.5rem] text-center"
                        aria-label={`Current quantity: ${cartItem.quantity}`}
                      >
                        {cartItem.quantity}
                      </span>
                      <button 
                        onClick={() => handleQuantityChange(product, unit, 1)} 
                        className="px-3 py-1.5 text-green-600 font-bold text-lg hover:bg-green-50 transition-colors focus:outline-none focus:ring-1 focus:ring-green-500"
                        aria-label={`Increase ${unit.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleQuantityChange(product, unit, 1)} 
                      className="border border-green-600 text-green-600 font-bold py-2 px-6 text-sm rounded-md hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                      aria-label={`Add ${unit.name} to cart`}
                    >
                      ADD
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-5 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2 text-gray-600 font-medium hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};