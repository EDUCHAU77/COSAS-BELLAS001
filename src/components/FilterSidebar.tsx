import React from 'react';
import { Filter, X } from 'lucide-react';
import { FilterState } from '../types';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42'];
const COLORS = ['Rosa', 'Morado', 'Azul', 'Verde', 'Negro', 'Blanco', 'Rojo', 'Amarillo'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onClose
}) => {
  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = value;
    onFiltersChange({ ...filters, priceRange: newRange });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    onFiltersChange({ ...filters, sizes: newSizes });
  };

  const handleColorToggle = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    onFiltersChange({ ...filters, colors: newColors });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: '',
      subcategory: '',
      gender: '',
      priceRange: [0, 500],
      sizes: [],
      colors: [],
      inStock: false
    });
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          data-testid="overlay"
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static top-16 right-0 h-full lg:h-auto w-80 lg:w-64 bg-white z-50 lg:z-auto
        transform lg:transform-none transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        border-l lg:border-l-0 lg:border-r border-gray-200
      `}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearAllFilters}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Limpiar
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-1 hover:bg-gray-100 rounded"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Rango de precio */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Precio</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Mín"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Máx"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <input
                type="range"
                min="0"
                max="500"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Tallas */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Tallas</h3>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeToggle(size)}
                  className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                    filters.sizes.includes(size)
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colores */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Colores</h3>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorToggle(color)}
                  className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                    filters.colors.includes(color)
                      ? 'border-purple-500 scale-110'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                  style={{
                    backgroundColor: color.toLowerCase() === 'rosa' ? '#f9b5d5' :
                                   color.toLowerCase() === 'morado' ? '#b26dff' :
                                   color.toLowerCase() === 'azul' ? '#3b82f6' :
                                   color.toLowerCase() === 'verde' ? '#10b981' :
                                   color.toLowerCase() === 'negro' ? '#000000' :
                                   color.toLowerCase() === 'blanco' ? '#ffffff' :
                                   color.toLowerCase() === 'rojo' ? '#ef4444' :
                                   color.toLowerCase() === 'amarillo' ? '#f59e0b' : '#d1d5db'
                  }}
                  title={color}
                >
                  {filters.colors.includes(color) && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Solo en stock */}
          <div className="mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => onFiltersChange({ ...filters, inStock: e.target.checked })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Solo productos en stock</span>
            </label>
          </div>
        </div>
      </aside>
    </>
  );
};