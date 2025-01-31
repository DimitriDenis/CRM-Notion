// src/components/layout/__tests__/Header.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';

describe('Header', () => {
  const mockOpenSidebar = jest.fn();

  beforeEach(() => {
    mockOpenSidebar.mockClear();
  });

  it('renders header elements', () => {
    render(<Header openSidebar={mockOpenSidebar} />);
    
    expect(screen.getByRole('button', { name: /ouvrir la sidebar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voir les notifications/i })).toBeInTheDocument();
  });

  it('calls openSidebar when menu button is clicked', () => {
    render(<Header openSidebar={mockOpenSidebar} />);
    
    fireEvent.click(screen.getByRole('button', { name: /ouvrir la sidebar/i }));
    expect(mockOpenSidebar).toHaveBeenCalled();
  });
});