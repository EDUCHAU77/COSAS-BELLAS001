import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FilterSidebar } from './FilterSidebar';
import { FilterState } from '../types';

const defaultFilterState: FilterState = {
  category: '',
  subcategory: '',
  gender: '',
  priceRange: [0, 500],
  sizes: [],
  colors: [],
  inStock: false,
};

describe('FilterSidebar', () => {
  const defaultProps = {
    filters: defaultFilterState,
    onFiltersChange: vi.fn(),
    isOpen: false,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the FilterSidebar title and clear button', () => {
    render(<FilterSidebar {...defaultProps} isOpen={true} />);
    expect(screen.getByText('Filtros')).toBeInTheDocument();
    expect(screen.getByText('Limpiar')).toBeInTheDocument();
  });

  it('should render price range inputs and slider', () => {
    render(<FilterSidebar {...defaultProps} isOpen={true} />);
    expect(screen.getByPlaceholderText('Mín')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Máx')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('should render all size buttons', () => {
    render(<FilterSidebar {...defaultProps} isOpen={true} />);
    const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42'];
    SIZES.forEach(size => {
      expect(screen.getByRole('button', { name: size })).toBeInTheDocument();
    });
  });

  it('should render all color buttons', () => {
    render(<FilterSidebar {...defaultProps} isOpen={true} />);
    const COLORS = ['Rosa', 'Morado', 'Azul', 'Verde', 'Negro', 'Blanco', 'Rojo', 'Amarillo'];
    COLORS.forEach(color => {
      expect(screen.getByTitle(color)).toBeInTheDocument();
    });
  });

  it('should render the in-stock checkbox', () => {
    render(<FilterSidebar {...defaultProps} isOpen={true} />);
    expect(screen.getByLabelText('Solo productos en stock')).toBeInTheDocument();
  });

  it('should call onFiltersChange when min price input changes', () => {
    render(<FilterSidebar {...defaultProps} isOpen={true} />);
    const minInput = screen.getByPlaceholderText('Mín');
    fireEvent.change(minInput, { target: { value: '50' } });
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      ...defaultFilterState, priceRange: [50, 500]
    });
  });

  it('should call onFiltersChange when max price input changes', () => {
    render(<FilterSidebar {...defaultProps} isOpen={true} />);
    const maxInput = screen.getByPlaceholderText('Máx');
    fireEvent.change(maxInput, { target: { value: '400' } });
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      ...defaultFilterState, priceRange: [0, 400]
    });
  });

  it('should add a size to filters when a size button is clicked', () => {
    render(<FilterSidebar {...defaultProps} isOpen={true} />);
    const sizeM = screen.getByRole('button', { name: 'M' });
    fireEvent.click(sizeM);
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      ...defaultFilterState, sizes: ['M']
    });
  });

  it('should remove a size from filters when an active size button is clicked again', () => {
    const changedFilters = { ...defaultFilterState, sizes: ['M'] };
    render(<FilterSidebar {...defaultProps} filters={changedFilters} isOpen={true} />);
    const sizeM = screen.getByRole('button', { name: 'M' });
    fireEvent.click(sizeM);
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      ...defaultFilterState, sizes: []
    });
  });

  it('should add a color to filters when a color button is clicked', () => {
    render(<FilterSidebar {...defaultProps} isOpen={true} />);
    const colorBlue = screen.getByTitle('Azul');
    fireEvent.click(colorBlue);
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      ...defaultFilterState, colors: ['Azul']
    });
  });

  it('should remove a color from filters when an active color button is clicked again', () => {
    const changedFilters = { ...defaultFilterState, colors: ['Azul'] };
    render(<FilterSidebar {...defaultProps} filters={changedFilters} isOpen={true} />);
    const colorBlue = screen.getByTitle('Azul');
    fireEvent.click(colorBlue);
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      ...defaultFilterState, colors: []
    });
  });

  it('should call onFiltersChange when in-stock checkbox is toggled', () => {
    render(<FilterSidebar {...defaultProps} isOpen={true} />);
    const inStockCheckbox = screen.getByLabelText('Solo productos en stock');
    fireEvent.click(inStockCheckbox);
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      ...defaultFilterState, inStock: true
    });
  });

  it('should call onFiltersChange with default state when clear button is clicked', () => {
    const changedFilters = { ...defaultFilterState, sizes: ['M'], colors: ['Rojo'] };
    render(<FilterSidebar {...defaultProps} filters={changedFilters} isOpen={true} />);
    fireEvent.click(screen.getByText('Limpiar'));
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith(defaultFilterState);
  });

  it('should call onClose when close button is clicked (mobile view)', () => {
    // Simulate mobile view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });
    render(<FilterSidebar {...defaultProps} isOpen={true} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close filters' }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should show and hide overlay based on isOpen prop', () => {
    const { rerender } = render(<FilterSidebar {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();

    rerender(<FilterSidebar {...defaultProps} isOpen={true} />);
    expect(screen.getByTestId('overlay')).toBeInTheDocument();
  });

  it('should call onClose when overlay is clicked', () => {
    render(<FilterSidebar {...defaultProps} isOpen={true} />);
    const overlay = screen.getByTestId('overlay');
    fireEvent.click(overlay);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});