import { Product, FilterState } from '../types';

export const filterProducts = (products: Product[], filters: FilterState, searchQuery: string): Product[] => {
  return products.filter(product => {
    // Búsqueda por texto
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filtrar por categoría
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Filtrar por subcategoría
    if (filters.subcategory && product.subcategory !== filters.subcategory) {
      return false;
    }

    // Filtrar por género
    if (filters.gender && product.gender !== filters.gender) {
      return false;
    }

    // Filtrar por rango de precio
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // Filtrar por tallas
    if (filters.sizes.length > 0 && !filters.sizes.some(size => product.sizes.includes(size))) {
      return false;
    }

    // Filtrar por colores
    if (filters.colors.length > 0 && !filters.colors.some(color => product.colors.includes(color))) {
      return false;
    }

    // Filtrar por stock
    if (filters.inStock && product.stock === 0) {
      return false;
    }

    return true;
  });
};

export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => a.id.localeCompare(b.id));
    default:
      return sorted;
  }
};