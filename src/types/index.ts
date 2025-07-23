export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory: string;
  gender: 'hombre' | 'mujer' | 'niño' | 'niña' | 'bebe-masculino' | 'bebe-femenino';
  sizes: string[];
  colors: string[];
  description: string;
  stock: number;
  rating: number;
  reviews: Review[];
  isFavorite?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  productCount: number;
}

export interface FilterState {
  category: string;
  subcategory: string;
  gender: string;
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'mercadopago' | 'brubank' | 'naranja';
  link?: string;
  cbu?: string;
  alias?: string;
  enabled: boolean;
}