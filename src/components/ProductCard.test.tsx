import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'A great test product.',
  price: 100,
  originalPrice: 120,
  images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
  category: 'clothing',
  subcategory: 'tshirts',
  gender: 'unisex',
  sizes: ['S', 'M', 'L'],
  colors: ['Rojo', 'Azul', 'Verde', 'Negro'],
  stock: 5,
  rating: 4.5,
  reviews: 10,
  isFavorite: false,
};

const mockProductOutOfStock: Product = {
  ...mockProduct,
  id: '2',
  name: 'Out of Stock Product',
  stock: 0,
};

const mockProductNoDiscount: Product = {
  ...mockProduct,
  id: '3',
  name: 'No Discount Product',
  originalPrice: undefined,
};

const mockProductSingleImage: Product = {
  ...mockProduct,
  id: '4',
  name: 'Single Image Product',
  images: ['image1.jpg'],
};

describe('ProductCard', () => {
  const defaultProps = {
    product: mockProduct,
    onAddToCart: vi.fn(),
    onToggleFavorite: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render product details: name, price, image, rating', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('(4.5)')).toBeInTheDocument();
    expect(screen.getAllByTestId('star-icon').length).toBe(5);
  });

  it('should display the discount percentage when applicable', () => {
    render(<ProductCard {...defaultProps} product={mockProduct} />);
    expect(screen.getByText('-17%')).toBeInTheDocument(); // (1 - 100/120) * 100 = 16.66 -> 17%
    expect(screen.getByText('$120')).toBeInTheDocument();
  });

  it('should not display discount percentage when not applicable', () => {
    render(<ProductCard {...defaultProps} product={mockProductNoDiscount} />);
    expect(screen.queryByText(/-%/)).not.toBeInTheDocument();
    expect(screen.queryByText('$120')).not.toBeInTheDocument();
  });

  it('should change main image on thumbnail hover', async () => {
    render(<ProductCard {...defaultProps} />);
    const mainImage = screen.getByAltText('Test Product') as HTMLImageElement;
    expect(mainImage.src).toContain('image1.jpg');

    const thumbnailButtons = screen.getAllByLabelText(/View image/);
    fireEvent.mouseEnter(thumbnailButtons[1]);

    await waitFor(() => {
      expect(mainImage.src).toContain('image2.jpg');
    });
  });

  it('should call onToggleFavorite when favorite button is clicked', () => {
    render(<ProductCard {...defaultProps} />);
    const favoriteButton = screen.getByLabelText('Toggle favorite');
    fireEvent.click(favoriteButton);
    expect(defaultProps.onToggleFavorite).toHaveBeenCalledTimes(1);
    expect(defaultProps.onToggleFavorite).toHaveBeenCalledWith(mockProduct.id);
  });

  it('should change favorite button style when product is favorited', () => {
    const favoritedProduct = { ...mockProduct, isFavorite: true };
    render(<ProductCard {...defaultProps} product={favoritedProduct} />);
    const favoriteButton = screen.getByLabelText('Toggle favorite');
    expect(favoriteButton).toHaveClass('bg-pink-500');
  });

  it('should open zoom modal when zoom button is clicked', () => {
    render(<ProductCard {...defaultProps} />);
    const zoomButton = screen.getByLabelText('Zoom in');
    fireEvent.click(zoomButton);
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(screen.getByAltText('Test Product', { selector: 'div[role="dialog"] img' })).toBeInTheDocument(); // More specific selector
    expect(screen.getByLabelText('Close zoom')).toBeInTheDocument();
  });

  it('should close zoom modal when close button is clicked', () => {
    render(<ProductCard {...defaultProps} />);
    const zoomButton = screen.getByLabelText('Zoom in');
    fireEvent.click(zoomButton);
    
    const closeButton = screen.getByLabelText('Close zoom');
    fireEvent.click(closeButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should close zoom modal when overlay is clicked', () => {
    render(<ProductCard {...defaultProps} />);
    const zoomButton = screen.getByLabelText('Zoom in');
    fireEvent.click(zoomButton);
    
    const overlay = screen.getByRole('dialog'); // The dialog itself is the overlay
    fireEvent.click(overlay);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should call onAddToCart when add to cart button is clicked', () => {
    render(<ProductCard {...defaultProps} />);
    const addToCartButton = screen.getByRole('button', { name: 'Agregar al Carrito' });
    fireEvent.click(addToCartButton);
    expect(defaultProps.onAddToCart).toHaveBeenCalledTimes(1);
    expect(defaultProps.onAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should disable add to cart button and show "Agotado" when stock is 0', () => {
    render(<ProductCard {...defaultProps} product={mockProductOutOfStock} />);
    const addToCartButton = screen.getByRole('button', { name: 'Agotado' });
    expect(addToCartButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Agotado' })).toHaveTextContent('Agotado');
  });

  it('should display stock quantity when stock is greater than 0', () => {
    render(<ProductCard {...defaultProps} product={mockProduct} />);
    expect(screen.getByText('Stock: 5')).toBeInTheDocument();
  });

  it('should display product colors', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getAllByTestId('color-swatch').length).toBe(3); // Expecting 3 swatches as per slice(0,3)
    expect(screen.getByTitle('Rojo')).toBeInTheDocument();
    expect(screen.getByTitle('Azul')).toBeInTheDocument();
  });

  it('should display +X when there are more than 3 colors', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText('+1')).toBeInTheDocument(); // 4 colors in mockProduct, so 4-3 = +1
  });

  it('should not display +X when there are 3 or less colors', () => {
    const productThreeColors = { ...mockProduct, colors: ['Rojo', 'Azul', 'Verde'] };
    render(<ProductCard {...defaultProps} product={productThreeColors} />);
    expect(screen.queryByText(/+d/)).not.toBeInTheDocument();
  });

  it('should not display image thumbnails if only one image is present', () => {
    render(<ProductCard {...defaultProps} product={mockProductSingleImage} />);
    const thumbnailButtons = screen.queryAllByLabelText(/View image/);
    expect(thumbnailButtons.length).toBe(0);
  });
});