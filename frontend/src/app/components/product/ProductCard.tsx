// src/app/components/product/ProductCard.tsx
'use client';

import { useCart } from '../CartContext';
import { ProductImage } from '../ui/ProductImage';
import type { Product, Unit } from '../CartContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (e: React.MouseEvent, product: Product, unit: Unit) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { cart } = useCart();
  const defaultUnit = product.allowedUnits[0];
  const hasDiscount = defaultUnit.discountPercentage && defaultUnit.discountPercentage > 0;
  const discountedPrice = hasDiscount 
    ? defaultUnit.price - (defaultUnit.price * (defaultUnit.discountPercentage! / 100)) 
    : defaultUnit.price;
  const totalQuantityInCart = cart
    .filter(item => item.productId === product._id)
    .reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="bg-white rounded-lg border border-gray-200 flex flex-col group h-full overflow-hidden hover:shadow-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-green-500">
      <div className="relative">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 z-10">
            <div 
              className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm"
              role="text"
              aria-label={`${defaultUnit.discountPercentage}% discount`}
            >
              {defaultUnit.discountPercentage}% OFF
            </div>
          </div>
        )}

        {/* Product Image */}
        <div className="w-full h-36 relative">
          <ProductImage
            src={product.imageUrl}
            alt={`${product.name} - Fresh ${product.category}`}
            className="w-full h-full rounded-t-lg"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        </div>

        {/* Quantity Badge */}
        {totalQuantityInCart > 0 && (
          <div className="absolute top-2 right-2 z-10">
            <span 
              className="bg-green-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-sm"
              aria-label={`${totalQuantityInCart} items in cart`}
            >
              {totalQuantityInCart}
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 flex flex-col flex-grow">
        <h2 className="text-sm font-medium text-gray-900 flex-grow leading-tight mb-2 group-hover:text-green-700 transition-colors">
          {product.name}
        </h2>
        <p className="text-xs text-gray-600 mb-3" aria-label={`Unit size: ${defaultUnit.name}`}>
          {defaultUnit.name}
        </p>
        
        {/* Price and Add Button */}
        <div className="flex justify-between items-end mt-auto">
          <div className="flex flex-col">
            <p className="text-base font-bold text-gray-900" aria-label={`Current price: ₹${discountedPrice.toFixed(0)}`}>
              ₹{discountedPrice.toFixed(0)}
            </p>
            {hasDiscount && (
              <p className="text-xs text-gray-500 line-through" aria-label={`Original price: ₹${defaultUnit.price}`}>
                ₹{defaultUnit.price}
              </p>
            )}
          </div>
          
          <button 
            onClick={(e) => onAddToCart(e, product, defaultUnit)} 
            className="border border-green-600 text-green-600 font-bold py-1.5 px-4 text-xs rounded-md hover:bg-green-600 hover:text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
            aria-label={`Add ${product.name} to cart`}
          >
            ADD
          </button>
        </div>
      </div>
    </article>
  );
};