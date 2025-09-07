export interface Unit {
  id: string;
  name: string;
  price: number;
  discountPercentage: number;
}

export interface Description {
  id: string;
  details: string;
  healthBenefits: string;
  shelfLife: string;
  countryOfOrigin: string;
  seller: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  imageUrl?: string | null;
  maxOrderLimit: number;
  allowedUnits: Unit[];
  description?: Description | null;
}

// The cart will ONLY store this minimal information
export interface CartItem {
  unitId: string;
  quantity: number;
}

// We'll create this "Display" version temporarily inside components for rendering
export interface DisplayCartItem extends CartItem {
  product: Product;
  unit: Unit;
}

export interface User {
  id: string;
  name?: string | null;
  phone: string;
  email?: string | null;
  role: 'CUSTOMER' | 'ADMIN' | 'DELIVERY_PARTNER';
}

export interface Address {
  id: string;
  addressLine: string;
  pincode: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  product: Product;
  unit: Unit;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress?: Address;
}