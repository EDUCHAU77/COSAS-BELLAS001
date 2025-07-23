import { render, screen } from '@testing-library/react';
import App from './App.tsx';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('should render the App component', () => {
    render(<App />);
    expect(screen.getByText('Vite + React')).toBeInTheDocument();
  });
});