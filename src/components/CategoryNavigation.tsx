import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Category } from '../types';

interface CategoryNavigationProps {
  categories: Category[];
  selectedCategory: string;
  selectedSubcategory: string;
  onCategorySelect: (categoryId: string) => void;
  onSubcategorySelect: (subcategoryId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  categories,
  selectedCategory,
  selectedSubcategory,
  onCategorySelect,
  onSubcategorySelect,
  isOpen,
  onClose
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string>(selectedCategory);

  // Update expandedCategory when selectedCategory changes from outside
  React.useEffect(() => {
    setExpandedCategory(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory('');
      onCategorySelect(''); // Deselect category when collapsing
    } else {
      setExpandedCategory(categoryId);
      onCategorySelect(categoryId);
    }
    onSubcategorySelect(''); // Always reset subcategory when a main category is clicked
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    onSubcategorySelect(subcategoryId);
    if (window.innerWidth < 1024) {
      onClose();
    }
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
      
      {/* Menú de categorías */}
      <aside className={`
        fixed lg:static top-16 left-0 h-full lg:h-auto w-80 lg:w-64 bg-white lg:bg-transparent z-50 lg:z-auto
        transform lg:transform-none transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-gray-200 lg:border-r-0
      `}>
        <div className="p-4 lg:p-0">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 lg:hidden">Categorías</h2>
          
          {/* Categorías principales */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200 text-center
                  ${selectedCategory === category.id
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                  }
                `}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Subcategorías */}
          {expandedCategory && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <ChevronDown size={16} className="mr-2" />
                Subcategorías
              </h3>
              <div className="space-y-2">
                {categories
                  .find(cat => cat.id === expandedCategory)
                  ?.subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => handleSubcategoryClick(subcategory.id)}
                      className={`
                        w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between
                        ${selectedSubcategory === subcategory.id
                          ? 'bg-purple-100 text-purple-700'
                          : 'hover:bg-white hover:shadow-sm'
                        }
                      `}
                    >
                      <span className="text-sm">{subcategory.name}</span>
                      <span className="text-xs text-gray-500">({subcategory.productCount})</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};