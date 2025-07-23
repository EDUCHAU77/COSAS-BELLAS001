import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, ZoomIn } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageHover = (index: number) => {
    setCurrentImageIndex(index);
  };

  const discountPercentage = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group">
      {/* Imagen principal */}
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Botones de acción */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleFavorite(product.id)}
            className={`p-2 rounded-full transition-colors ${
              product.isFavorite
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-600 hover:bg-pink-50'
            }`}
          >
            <Heart size={16} fill={product.isFavorite ? 'currentColor' : 'none'} />
          </button>
          
          <button
            onClick={() => setIsZoomed(true)}
            className="p-2 bg-white text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        {/* Badge de descuento */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{discountPercentage}%
          </div>
        )}

        {/* Miniaturas de imágenes */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-3 flex space-x-1">
            {product.images.slice(0, 3).map((_, index) => (
              <button
                key={index}
                onMouseEnter={() => handleImageHover(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={`${
                i < Math.floor(product.rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
        </div>

        {/* Precio */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-purple-600">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Colores disponibles */}
        <div className="flex items-center space-x-1 mb-3">
          <span className="text-xs text-gray-600">Colores:</span>
          {product.colors.slice(0, 3).map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{
                backgroundColor: color.toLowerCase() === 'rosa' ? '#f9b5d5' :
                                color.toLowerCase() === 'morado' ? '#b26dff' :
                                color.toLowerCase() === 'azul' ? '#3b82f6' :
                                color.toLowerCase() === 'verde' ? '#10b981' :
                                color.toLowerCase() === 'negro' ? '#000000' :
                                color.toLowerCase() === 'blanco' ? '#ffffff' : '#d1d5db'
              }}
            />
          ))}
          {product.colors.length > 3 && (
            <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
          )}
        </div>

        {/* Stock */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs px-2 py-1 rounded-full ${
            product.stock > 10
              ? 'bg-green-100 text-green-700'
              : product.stock > 0
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
          </span>
        </div>

        {/* Botón agregar al carrito */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className={`w-full py-2 px-4 rounded-full font-semibold transition-colors flex items-center justify-center space-x-2 ${
            product.stock > 0
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={16} />
          <span>{product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}</span>
        </button>
      </div>

      {/* Modal de zoom */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};