'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';
import type { Product, Unit,CartItem } from './CartContext';

const CartSidebar = () => {
  const { cart, handleQuantityChange, cartTotal, isLoggedIn, toggleLogin, isCartSidebarOpen, toggleCartSidebar } = useCart();
  
  const deliveryFee = 29;
  const total = cartTotal + deliveryFee;

  const findProductForCartItem = (item: CartItem): Product => ({
    _id: item.productId, name: item.name, maxOrderLimit: item.maxOrderLimit,
    category: '', allowedUnits: [],
  });

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isCartSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleCartSidebar}
      ></div>
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white text-gray-800 shadow-xl z-50 transform  transition-transform duration-300 ${isCartSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">My Cart</h2>
            <button onClick={toggleCartSidebar} className="text-2xl">&times;</button>
          </div>
          
          {/* Items */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {cart.map(item => {
              const hasDiscount = item.unit.discountPercentage && item.unit.discountPercentage > 0;
              const discountedPrice = hasDiscount ? item.unit.price - (item.unit.price * (item.unit.discountPercentage! / 100)) : item.unit.price;
              const product = findProductForCartItem(item);
              return (
                <div key={`${item.productId}-${item.unit.name}`} className="flex items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-md mr-4"></div>
                  <div className="flex-grow">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.unit.name}</p>
                    <p className="text-sm font-bold mt-1">₹{(discountedPrice * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center border border-green-600 rounded-md">
                    <button onClick={() => handleQuantityChange(product, item.unit, -1)} className="px-3 py-1 font-bold">-</button>
                    <span className="px-3 py-1 text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(product, item.unit, 1)} className="px-3 py-1 font-bold">+</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <button 
              onClick={!isLoggedIn ? toggleLogin : () => alert('Proceeding to checkout!')}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700  px-4 transition-colors flex justify-between items-center"
            >
              <div>
                <p className="text-sm">{cart.length} Item{cart.length !== 1 ? 's' : ''}</p>
                <p className="font-extrabold">₹{total.toFixed(2)}</p>
              </div>
              <span className="text-lg font-bold">
                {isLoggedIn ? 'Proceed' : 'Login to Proceed'} &rarr;
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const Header = ({ searchTerm, setSearchTerm }: { searchTerm?: string; setSearchTerm?: (term: string) => void; }) => {
  const { cart,isLoggedIn, toggleLogin, cartTotal, toggleCartSidebar } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-green-600">VeggieKart</a>
        
        {/* Search Bar */}
        {setSearchTerm && (
          <div className="hidden md:block w-1/2 lg:w-1/3">
            <input 
              type="text" 
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm text-black"
            />
          </div>
        )}

        {/* Right side buttons */}
        <div className="flex items-center space-x-6">
          <button onClick={toggleLogin} className="font-semibold text-gray-800 hover:text-green-600 transition-colors">
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
          
          {/* Cart Button */}
           <button onClick={toggleCartSidebar} className="hidden md:flex bg-green-600 text-white px-4 py-2 rounded-lg items-center space-x-2 hover:bg-green-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <span className="text-sm font-bold">{cart.length} Item{cart.length !== 1 ? 's' : ''}</span>
              <p className="text-xs">₹{cartTotal.toFixed(2)}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export const UnitSelectionModal = ({ product, onClose }: { product: Product; onClose: () => void; }) => {
  const { cart, handleQuantityChange } = useCart();
  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
          <button onClick={onClose} className="text-2xl text-gray-800">&times;</button>
        </div>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {product.allowedUnits.map((unit) => {
            const hasDiscount = unit.discountPercentage && unit.discountPercentage > 0;
            const discountedPrice = hasDiscount ? unit.price - (unit.price * (unit.discountPercentage! / 100)) : unit.price;
            const cartItem = cart.find(item => item.productId === product._id && item.unit.name === unit.name);
            return (
              <div key={unit.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{unit.name}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-base font-bold text-gray-900">₹{discountedPrice.toFixed(0)}</p>
                    {hasDiscount && <p className="text-xs text-gray-800 line-through">₹{unit.price}</p>}
                  </div>
                </div>
                {cartItem && cartItem.quantity > 0 ? (
                  <div className="flex items-center border border-green-600 rounded-md">
                    <button onClick={() => handleQuantityChange(product, unit, -1)} className="px-3 py-1 text-green-600 font-bold text-lg">-</button>
                    <span className="px-3 py-1 text-sm font-bold text-gray-900">{cartItem.quantity}</span>
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

export const ProductCard = ({ product, onAddToCart }: { product: Product; onAddToCart: (e: React.MouseEvent, product: Product, unit: Unit) => void; }) => {
  const { cart } = useCart();
  const defaultUnit = product.allowedUnits[0];
  const hasDiscount = defaultUnit.discountPercentage && defaultUnit.discountPercentage > 0;
  const discountedPrice = hasDiscount ? defaultUnit.price - (defaultUnit.price * (defaultUnit.discountPercentage! / 100)) : defaultUnit.price;
  const totalQuantityInCart = cart.filter(item => item.productId === product._id).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 flex flex-col group h-full overflow-hidden">
      <div className="relative">
        <div className="absolute top-2 left-2 z-10">
          {hasDiscount && <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">{defaultUnit.discountPercentage}% OFF</div>}
        </div>
        <div className="w-full h-36 bg-gray-100 flex items-center justify-center"><span className="text-gray-800 text-xs">{product.name}</span></div>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h2 className="text-sm font-medium text-gray-900 flex-grow leading-tight mb-2">{product.name}</h2>
        <p className="text-xs text-gray-800 mb-2">{defaultUnit.name}</p>
        <div className="flex justify-between items-center mt-auto pt-2">
          <div className="h-10 flex flex-col justify-center">
            <p className="text-base font-bold text-gray-900">₹{discountedPrice.toFixed(0)}</p>
            {hasDiscount ? <p className="text-xs text-gray-800 line-through">₹{defaultUnit.price}</p> : <p className="text-xs">&nbsp;</p>}
          </div>
          <button onClick={(e) => onAddToCart(e, product, defaultUnit)} className="border border-green-600 text-green-600 font-bold py-1 px-4 text-xs rounded-md hover:bg-green-600 hover:text-white transition-colors relative">
            ADD
            {totalQuantityInCart > 0 && <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{totalQuantityInCart}</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProductDetailClient = ({ product }: { product: Product }) => {
  const { cart, handleQuantityChange } = useCart();
  const desc = product.description; 

  return (
    <main className="container mx-auto p-4 lg:w-[76%]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="p-4">
          <div className="w-full h-80 bg-gray-100 flex items-center justify-center rounded-lg">
            <span className="text-gray-800">{product.name} Image</span>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-lg text-gray-800 mt-2">{desc?.unit || product.allowedUnits[0].name}</p>
          
          {/* Unit Selection and Add to Cart */}
          <div className="mt-6">
            {product.allowedUnits.map(unit => {
              const cartItem = cart.find(item => item.productId === product._id && item.unit.name === unit.name);
              const hasDiscount = unit.discountPercentage && unit.discountPercentage > 0;
              const discountedPrice = hasDiscount ? unit.price - (unit.price * (unit.discountPercentage! / 100)) : unit.price;

              return (
                <div key={unit.name} className="flex justify-between items-center p-4 border rounded-lg mb-3">
                  <div>
                    <p className="font-semibold">{unit.name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xl font-bold">₹{discountedPrice.toFixed(0)}</p>
                      {hasDiscount && <p className="text-md text-gray-800 line-through">₹{unit.price}</p>}
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

      {/* Product Description Section */}
      {desc && (
        <div className="mt-8 p-4">
          <h2 className="font-bold text-xl mb-4">Product Details</h2>
          <div className="space-y-3 text-gray-800 text-sm">
            {desc.details && <p>{desc.details}</p>}
            {desc.healthBenefits && <p><strong>Health Benefits:</strong> {desc.healthBenefits}</p>}
            {desc.shelfLife && <p><strong>Shelf Life:</strong> {desc.shelfLife}</p>}
            {desc.countryOfOrigin && <p><strong>Country of Origin:</strong> {desc.countryOfOrigin}</p>}
            {desc.seller && <p><strong>Seller:</strong> {desc.seller}</p>}
            {desc.disclaimer && <p className="text-xs text-gray-800 mt-4"><strong>Disclaimer:</strong> {desc.disclaimer}</p>}
          </div>
        </div>
      )}
    </main>
  );
};

export const MobileCartBar = () => {
  const { cart,cartItemCount, cartTotal, toggleCartSidebar } = useCart();

  if (cartItemCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-green-600 text-white p-2 shadow-xl z-30 md:hidden rounded-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <p className="font-bold text-xs">{cart.length} Item{cart.length !== 1 ? 's' : ''}</p>
          <p className="text-sm font-extrabold">₹{cartTotal.toFixed(2)}</p>
        </div>
        <button onClick={toggleCartSidebar} className="font-bold text-sm flex items-center">
          View Cart 
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Main page component
export const ProductGrid = ({ initialProducts }: { initialProducts: Product[] }) => {
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
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      <main className="container mx-auto p-4 lg:w-[76%]">
        {/* Conditional Layout Logic */}
        {categoryCount > 0 && categoryCount < 3 ? (
          // --- GRID LAYOUT (for 1-2 categories) --//
          <section className="mb-10">
             {/* loop to print category titles */}
            {Object.entries(groupedProducts).map(([category]) => (
              <h2 key={category} className="text-2xl font-bold text-gray-900 mb-4">{category}</h2>
            ))}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {/* We render all products in a single grid */}
              {filteredProducts.map((product) => (
                <div key={product._id} className="w-full">
                   <Link href={`/product/${product._id}`}>
                    <ProductCard 
                      product={product} 
                      onAddToCart={(e, product, unit) => {
                        e.preventDefault();
                        handleAddToCartClick(product, unit);
                      }}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ) : (
          // --- SCROLLABLE LAYOUT (for 3+ categories) ---
          Object.entries(groupedProducts).map(([category, items]) => (
            <section key={category} className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{category}</h2>
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {items.map((product) => (
                  <div key={product._id} className="flex-shrink-0 w-40">
                     <Link href={`/product/${product._id}`}>
                      <ProductCard 
                        product={product} 
                        onAddToCart={(e, product, unit) => {
                          e.preventDefault();
                          handleAddToCartClick(product, unit);
                        }}
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}

        {/* No products found message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-900">No products found</h2>
            <p className="text-gray-600 mt-2">Try adjusting your search.</p>
          </div>
        )}
      </main>
      <MobileCartBar /> 
      {modalProduct && <UnitSelectionModal product={modalProduct} onClose={() => setModalProduct(null)} />}
    </>
  );
}
