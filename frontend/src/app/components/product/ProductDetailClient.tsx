// src/app/components/product/ProductDetailClient.tsx
'use client';

import { useCart } from '../CartContext';
import { ProductImage } from '../ui/ProductImage';
import type { Product } from '../CartContext';

interface ProductDetailClientProps {
  product: Product;
}

export const ProductDetailClient = ({ product }: ProductDetailClientProps) => {
  const { cart, handleQuantityChange } = useCart();
  const desc = product.description;

  return (
    <main className="container mx-auto p-4 lg:w-[76%]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="p-4">
          <div className="sticky top-24">
            <ProductImage
              src={product.imageUrl}
              alt={`${product.name} - Fresh ${product.category}`}
              className="w-full h-80 rounded-lg shadow-sm"
              priority={true}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="p-4 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600">{desc?.unit || product.allowedUnits[0].name}</p>
            {product.category && (
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {product.category}
              </span>
            )}
          </div>
          
          {/* Unit Selection and Add to Cart */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Available Sizes</h3>
            {product.allowedUnits.map(unit => {
              const cartItem = cart.find(item => 
                item.productId === product._id && item.unit.name === unit.name
              );
              const hasDiscount = unit.discountPercentage && unit.discountPercentage > 0;
              const discountedPrice = hasDiscount 
                ? unit.price - (unit.price * (unit.discountPercentage! / 100)) 
                : unit.price;

              return (
                <div 
                  key={unit.name} 
                  className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50/50 transition-colors"
                >
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-900">{unit.name}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <p className="text-xl font-bold text-gray-900">
                        ₹{discountedPrice.toFixed(0)}
                      </p>
                      {hasDiscount && (
                        <>
                          <p className="text-md text-gray-500 line-through">
                            ₹{unit.price}
                          </p>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                            {unit.discountPercentage}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Add/Update Controls */}
                  <div className="ml-6">
                    {cartItem ? (
                      <div 
                        className="flex items-center border border-green-600 rounded-md"
                        role="group"
                        aria-label={`Quantity controls for ${unit.name}`}
                      >
                        <button 
                          onClick={() => handleQuantityChange(product, unit, -1)} 
                          className="px-4 py-2 text-green-600 font-bold text-xl hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                          aria-label={`Decrease ${unit.name} quantity`}
                        >
                          -
                        </button>
                        <span 
                          className="px-4 py-2 text-md font-bold text-gray-900 min-w-[3rem] text-center"
                          aria-label={`Current quantity: ${cartItem.quantity}`}
                        >
                          {cartItem.quantity}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(product, unit, 1)} 
                          className="px-4 py-2 text-green-600 font-bold text-xl hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                          aria-label={`Increase ${unit.name} quantity`}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleQuantityChange(product, unit, 1)} 
                        className="border border-green-600 text-green-600 font-bold py-2 px-8 rounded-md hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                        aria-label={`Add ${unit.name} to cart`}
                      >
                        ADD TO CART
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Description Section */}
      {desc && (
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h2 className="font-bold text-xl mb-6 text-gray-900">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {desc.details && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{desc.details}</p>
              </div>
            )}
            
            {desc.healthBenefits && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Health Benefits</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{desc.healthBenefits}</p>
              </div>
            )}
            
            {desc.shelfLife && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Shelf Life</h3>
                <p className="text-gray-700 text-sm">{desc.shelfLife}</p>
              </div>
            )}
            
            {desc.countryOfOrigin && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Country of Origin</h3>
                <p className="text-gray-700 text-sm">{desc.countryOfOrigin}</p>
              </div>
            )}
            
            {desc.seller && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Seller</h3>
                <p className="text-gray-700 text-sm">{desc.seller}</p>
              </div>
            )}
            
            {desc.returnPolicy && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Return Policy</h3>
                <p className="text-gray-700 text-sm">{desc.returnPolicy}</p>
              </div>
            )}
          </div>
          
          {desc.disclaimer && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Disclaimer</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{desc.disclaimer}</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
};