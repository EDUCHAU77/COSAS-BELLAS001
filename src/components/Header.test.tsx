import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  const defaultProps = {
    cartItemsCount: 0,
    favoritesCount: 0,
    onMenuToggle: vi.fn(),
    isMenuOpen: false,
    onSearchChange: vi.fn(),
  };

  it('should render the logo text', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('COSAS BELLAS')).toBeInTheDocument();
  });

  it('should render the search input with correct placeholder', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByPlaceholderText('Buscar productos...')).toBeInTheDocument();
  });

  it('should call onSearchChange when search input value changes', () => {
    render(<Header {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Buscar productos...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    expect(defaultProps.onSearchChange).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test query');
  });

  it('should display correct cartItemsCount and favoritesCount', () => {
    render(<Header {...defaultProps} cartItemsCount={5} favoritesCount={3} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should call onMenuToggle when menu button is clicked', () => {
    render(<Header {...defaultProps} />);
    const menuButton = screen.getByRole('button', { name: /menu/i }) || screen.getByRole('button', { name: /close/i });
    fireEvent.click(menuButton);
    expect(defaultProps.onMenuToggle).toHaveBeenCalledTimes(1);
  });

  it('should show X icon when menu is open and Menu icon when closed', () => {
    const { rerender } = render(<Header {...defaultProps} isMenuOpen={false} />);
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();

    rerender(<Header {...defaultProps} isMenuOpen={true} />);
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });
});