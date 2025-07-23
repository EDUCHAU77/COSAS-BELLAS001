import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CategoryNavigation } from './CategoryNavigation';
import { Category } from '../types';

const mockCategories: Category[] = [
  {
    id: 'clothing',
    name: 'Ropa',
    icon: '👕',
    subcategories: [
      { id: 'tshirts', name: 'Camisetas', productCount: 10 },
      { id: 'pants', name: 'Pantalones', productCount: 8 },
    ],
  },
  {
    id: 'accessories',
    name: 'Accesorios',
    icon: '💍',
    subcategories: [
      { id: 'jewelry', name: 'Joyeria', productCount: 15 },
      { id: 'bags', name: 'Bolsos', productCount: 12 },
    ],
  },
];

describe('CategoryNavigation', () => {
  const defaultProps = {
    categories: mockCategories,
    selectedCategory: '',
    selectedSubcategory: '',
    onCategorySelect: vi.fn(),
    onSubcategorySelect: vi.fn(),
    isOpen: false,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all main categories', () => {
    render(<CategoryNavigation {...defaultProps} />);
    mockCategories.forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it('should call onCategorySelect and expand subcategories when a category is clicked', async () => {
    render(<CategoryNavigation {...defaultProps} />);
    const clothingCategoryButton = screen.getByRole('button', { name: /Ropa/i });
    fireEvent.click(clothingCategoryButton);

    expect(defaultProps.onCategorySelect).toHaveBeenCalledTimes(1);
    expect(defaultProps.onCategorySelect).toHaveBeenCalledWith('clothing');
    
    await waitFor(() => {
      expect(screen.getByText('Camisetas')).toBeInTheDocument();
      expect(screen.getByText('Pantalones')).toBeInTheDocument();
    });
  });

  it('should collapse subcategories when an expanded category is clicked again', async () => {
    const { rerender } = render(<CategoryNavigation {...defaultProps} selectedCategory="clothing" />);
    
    // Subcategories should be visible initially because selectedCategory is set
    await waitFor(() => {
      expect(screen.getByText('Camisetas')).toBeInTheDocument();
    });

    const clothingCategoryButton = screen.getByRole('button', { name: /Ropa/i });
    fireEvent.click(clothingCategoryButton);

    expect(defaultProps.onCategorySelect).toHaveBeenCalledTimes(1);
    expect(defaultProps.onCategorySelect).toHaveBeenCalledWith(''); // Should deselect
    
    await waitFor(() => {
      expect(screen.queryByText('Camisetas')).not.toBeInTheDocument();
    });
  });

  it('should call onSubcategorySelect and close the menu on mobile when a subcategory is clicked', async () => {
    // Simulate mobile view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<CategoryNavigation {...defaultProps} selectedCategory="clothing" />);

    // Ensure subcategories are visible before clicking
    await waitFor(() => {
      expect(screen.getByText('Camisetas')).toBeInTheDocument();
    });

    const tshirtsSubcategoryButton = screen.getByRole('button', { name: /Camisetas/i });
    fireEvent.click(tshirtsSubcategoryButton);

    expect(defaultProps.onSubcategorySelect).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSubcategorySelect).toHaveBeenCalledWith('tshirts');
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should highlight the selected category and subcategory', async () => {
    render(<CategoryNavigation {...defaultProps} selectedCategory="clothing" selectedSubcategory="tshirts" />);
    
    const clothingCategoryButton = screen.getByRole('button', { name: /Ropa/i });
    expect(clothingCategoryButton).toHaveClass('border-purple-500');
    
    await waitFor(() => {
      const tshirtsSubcategoryButton = screen.getByRole('button', { name: /Camisetas \(10\)/i });
      expect(tshirtsSubcategoryButton).toHaveClass('bg-purple-100');
    });
  });

  it('should show and hide overlay based on isOpen prop', () => {
    const { rerender } = render(<CategoryNavigation {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();

    rerender(<CategoryNavigation {...defaultProps} isOpen={true} />);
    expect(screen.getByTestId('overlay')).toBeInTheDocument();
  });

  it('should call onClose when overlay is clicked', () => {
    render(<CategoryNavigation {...defaultProps} isOpen={true} />);
    const overlay = screen.getByTestId('overlay');
    fireEvent.click(overlay);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});