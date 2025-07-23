import { Product, Category, PaymentMethod } from '../types';

export const categories: Category[] = [
  {
    id: 'hombre',
    name: 'Hombre',
    icon: '👨',
    subcategories: [
      { id: 'camisas', name: 'Camisas', productCount: 45 },
      { id: 'pantalones', name: 'Pantalones', productCount: 32 },
      { id: 'zapatos', name: 'Zapatos', productCount: 28 },
      { id: 'accesorios', name: 'Accesorios', productCount: 15 },
      { id: 'deportivo', name: 'Deportivo', productCount: 22 },
    ]
  },
  {
    id: 'mujer',
    name: 'Mujer',
    icon: '👩',
    subcategories: [
      { id: 'vestidos', name: 'Vestidos', productCount: 67 },
      { id: 'blusas', name: 'Blusas', productCount: 54 },
      { id: 'pantalones', name: 'Pantalones', productCount: 43 },
      { id: 'zapatos', name: 'Zapatos', productCount: 89 },
      { id: 'accesorios', name: 'Accesorios', productCount: 76 },
    ]
  },
  {
    id: 'niño',
    name: 'Niño',
    icon: '👦',
    subcategories: [
      { id: 'camisetas', name: 'Camisetas', productCount: 25 },
      { id: 'pantalones', name: 'Pantalones', productCount: 18 },
      { id: 'zapatos', name: 'Zapatos', productCount: 12 },
      { id: 'juguetes', name: 'Juguetes', productCount: 34 },
    ]
  },
  {
    id: 'niña',
    name: 'Niña',
    icon: '👧',
    subcategories: [
      { id: 'vestidos', name: 'Vestidos', productCount: 28 },
      { id: 'blusas', name: 'Blusas', productCount: 22 },
      { id: 'zapatos', name: 'Zapatos', productCount: 15 },
      { id: 'accesorios', name: 'Accesorios', productCount: 19 },
    ]
  },
  {
    id: 'bebe-masculino',
    name: 'Bebé Masculino',
    icon: '👶',
    subcategories: [
      { id: 'ropa', name: 'Ropa', productCount: 35 },
      { id: 'zapatos', name: 'Zapatos', productCount: 12 },
      { id: 'accesorios', name: 'Accesorios', productCount: 8 },
    ]
  },
  {
    id: 'bebe-femenino',
    name: 'Bebé Femenino',
    icon: '👶',
    subcategories: [
      { id: 'ropa', name: 'Ropa', productCount: 38 },
      { id: 'zapatos', name: 'Zapatos', productCount: 14 },
      { id: 'accesorios', name: 'Accesorios', productCount: 10 },
    ]
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Vestido Floral Elegante',
    price: 89.99,
    originalPrice: 129.99,
    images: [
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
      'https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg',
      'https://images.pexels.com/photos/1078958/pexels-photo-1078958.jpeg'
    ],
    category: 'mujer',
    subcategory: 'vestidos',
    gender: 'mujer',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Rosa', 'Azul', 'Verde'],
    description: 'Vestido floral elegante perfecto para cualquier ocasión especial.',
    stock: 15,
    rating: 4.5,
    reviews: []
  },
  {
    id: '2',
    name: 'Camisa Casual Hombre',
    price: 45.99,
    images: [
      'https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg',
      'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg'
    ],
    category: 'hombre',
    subcategory: 'camisas',
    gender: 'hombre',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blanco', 'Azul', 'Negro'],
    description: 'Camisa casual de algodón, perfecta para el día a día.',
    stock: 22,
    rating: 4.2,
    reviews: []
  },
  {
    id: '3',
    name: 'Zapatos Deportivos',
    price: 120.00,
    originalPrice: 150.00,
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
      'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg'
    ],
    category: 'mujer',
    subcategory: 'zapatos',
    gender: 'mujer',
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['Blanco', 'Rosa', 'Negro'],
    description: 'Zapatos deportivos cómodos para correr y entrenar.',
    stock: 8,
    rating: 4.8,
    reviews: []
  },
  {
    id: '4',
    name: 'Conjunto Infantil Niña',
    price: 35.99,
    images: [
      'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg'
    ],
    category: 'niña',
    subcategory: 'vestidos',
    gender: 'niña',
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['Rosa', 'Morado', 'Amarillo'],
    description: 'Conjunto adorable para niñas, cómodo y colorido.',
    stock: 12,
    rating: 4.6,
    reviews: []
  }
];

export const paymentMethods: PaymentMethod[] = [
  {
    id: '1',
    name: 'Mercado Pago',
    type: 'mercadopago',
    link: 'https://mpago.li/ejemplo',
    enabled: true
  },
  {
    id: '2',
    name: 'Brubank',
    type: 'brubank',
    cbu: '1234567890123456789012',
    alias: 'cosas.bellas.mp',
    enabled: true
  },
  {
    id: '3',
    name: 'Naranja X',
    type: 'naranja',
    link: 'https://naranja.com/pago/ejemplo',
    enabled: true
  }
];