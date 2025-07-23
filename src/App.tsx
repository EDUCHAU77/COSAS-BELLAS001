import React, { useState, useMemo } from 'react';
import { Filter, Settings } from 'lucide-react';
import { Header } from './components/Header';
import { CategoryNavigation } from './components/CategoryNavigation';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { AdminPanel } from './components/AdminPanel';
import { categories, mockProducts, paymentMethods } from './data/mockData';
import { filterProducts, sortProducts } from './utils/filterUtils';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Product, CartItem, FilterState, PaymentMethod } from './types';

function App() {
  const [products, setProducts] = useLocalStorage<Product[]>('cosas-bellas-products', mockProducts);
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('cosas-bellas-cart', []);
  const [favoriteProducts, setFavoriteProducts] = useLocalStorage<string[]>('cosas-bellas-favorites', []);
  const [paymentMethodsState, setPaymentMethodsState] = useLocalStorage<PaymentMethod[]>('cosas-bellas-payments', paymentMethods);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    subcategory: '',
    gender: '',
    priceRange: [0, 500],
    sizes: [],
    colors: [],
    inStock: false
  });
  const [sortBy, setSortBy] = useState('newest');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  // Actualizar productos con información de favoritos
  const productsWithFavorites = useMemo(() => {
    return products.map(product => ({
      ...product,
      isFavorite: favoriteProducts.includes(product.id)
    }));
  }, [products, favoriteProducts]);

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = filterProducts(productsWithFavorites, filters, searchQuery);
    return sortProducts(filtered, sortBy);
  }, [productsWithFavorites, filters, searchQuery, sortBy]);

  const handleCategorySelect = (categoryId: string) => {
    setFilters(prev => ({ ...prev, category: categoryId, subcategory: '' }));
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setFilters(prev => ({ ...prev, subcategory: subcategoryId }));
  };

  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newItem: CartItem = {
        product,
        quantity: 1,
        selectedSize: product.sizes[0] || '',
        selectedColor: product.colors[0] || ''
      };
      setCartItems([...cartItems, newItem]);
    }
    setIsCartOpen(true);
  };

  const handleToggleFavorite = (productId: string) => {
    if (favoriteProducts.includes(productId)) {
      setFavoriteProducts(favoriteProducts.filter(id => id !== productId));
    } else {
      setFavoriteProducts([...favoriteProducts, productId]);
    }
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    setCartItems(cartItems.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };

  const handleCheckout = (paymentMethodId: string) => {
    const method = paymentMethodsState.find(m => m.id === paymentMethodId);
    if (method) {
      alert(`Procesando pago con ${method.name}...`);
      // Aquí se implementaría la lógica real de pago
    }
  };

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleProductAdd = (newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: Date.now().toString()
    };
    setProducts([...products, product]);
  };

  const handleProductDelete = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const handlePaymentMethodUpdate = (updatedMethod: PaymentMethod) => {
    setPaymentMethodsState(paymentMethodsState.map(m => 
      m.id === updatedMethod.id ? updatedMethod : m
    ));
  };

  if (showAdmin) {
    return (
      <AdminPanel
        products={products}
        paymentMethods={paymentMethodsState}
        onProductUpdate={handleProductUpdate}
        onProductAdd={handleProductAdd}
        onProductDelete={handleProductDelete}
        onPaymentMethodUpdate={handlePaymentMethodUpdate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        favoritesCount={favoriteProducts.length}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
        onSearchChange={setSearchQuery}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-6">
          {/* Navegación de categorías */}
          <CategoryNavigation
            categories={categories}
            selectedCategory={filters.category}
            selectedSubcategory={filters.subcategory}
            onCategorySelect={handleCategorySelect}
            onSubcategorySelect={handleSubcategorySelect}
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
          />

          {/* Contenido principal */}
          <div className="flex-1">
            {/* Barra de herramientas */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-800">
                  {filters.category ? categories.find(c => c.id === filters.category)?.name : 'Todos los productos'}
                </h1>
                <span className="text-gray-500">({filteredAndSortedProducts.length} productos)</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="newest">Más recientes</option>
                  <option value="price-low">Precio: menor a mayor</option>
                  <option value="price-high">Precio: mayor a menor</option>
                  <option value="rating">Mejor valorados</option>
                </select>
                
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Filter size={16} />
                  <span>Filtros</span>
                </button>

                <button
                  onClick={() => setShowAdmin(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  <Settings size={16} />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Grid de productos */}
            <ProductGrid
              products={filteredAndSortedProducts}
              loading={loading}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>

          {/* Sidebar de filtros */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>
      </div>

      {/* Carrito */}
      <Cart
        cartItems={cartItems}
        paymentMethods={paymentMethodsState}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Botón flotante del carrito para móvil */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all lg:hidden"
      >
        <div className="relative">
          <Filter size={24} />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </div>
      </button>
    </div>
  );
}

export default App;