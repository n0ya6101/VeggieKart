export interface Unit {
  id: string;
  name: string;
  price: number;
  discountPercentage: number;
}

// Represents the detailed description of a product
export interface Description {
  id: string;
  details: string;
  healthBenefits: string;
  shelfLife: string;
  countryOfOrigin: string;
  seller: string;
}

// Represents a single product from your catalog
export interface Product {
  id: string;
  name: string;
  category: string;
  imageUrl?: string | null;
  maxOrderLimit: number;
  allowedUnits: Unit[];
  description?: Description | null;
}

// Represents an item in the user's shopping cart
export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  unit: Unit;
  maxOrderLimit: number;
  imageUrl?: string | null;
}

// Represents a logged-in user's data
export interface User {
  id: string;
  phone: string;
  email?: string | null;
  role: 'CUSTOMER' | 'ADMIN' | 'DELIVERY_PARTNER';
}

// Represents a user's saved address
export interface Address {
  id: string;
  addressLine: string;
  pincode: string;
  city: string;
  state: string;
  isDefault: boolean;
}
