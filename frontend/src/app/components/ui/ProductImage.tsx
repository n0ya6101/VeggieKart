// src/app/components/ui/ProductImage.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export const ProductImage = ({ 
  src, 
  alt, 
  width = 400, 
  height = 400, 
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: ProductImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback placeholder image or generate a simple colored placeholder
  const placeholderSrc = '/images/placeholder-product.svg';
  
  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (!src || imageError) {
    // Fallback to a placeholder
    return (
      <div className={`bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-gray-600 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 opacity-50">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21,19V5c0,-1.1 -0.9,-2 -2,-2H5c-1.1,0 -2,0.9 -2,2v14c0,1.1 0.9,2 2,2h14C20.1,21 21,20.1 21,19zM8.5,13.5l2.5,3.01L14.5,12l4.5,6H5L8.5,13.5z"/>
            </svg>
          </div>
          <span className="text-xs font-medium">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        priority={priority}
        sizes={sizes}
        quality={85}
      />
    </div>
  );
};