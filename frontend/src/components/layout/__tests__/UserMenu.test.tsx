// src/components/layout/__tests__/UserMenu.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserMenu } from '../UserMenu';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('UserMenu', () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    Storage.prototype.removeItem = jest.fn();
  });

  it('renders user menu button', () => {
    render(<UserMenu />);
    expect(screen.getByRole('button', { name: /ouvrir le menu utilisateur/i })).toBeInTheDocument();
  });

  it('shows menu items on click', () => {
    render(<UserMenu />);
    
    fireEvent.click(screen.getByRole('button', { name: /ouvrir le menu utilisateur/i }));
    expect(screen.getByText('Se déconnecter')).toBeInTheDocument();
  });

  it('handles logout correctly', () => {
    render(<UserMenu />);
    
    fireEvent.click(screen.getByRole('button', { name: /ouvrir le menu utilisateur/i }));
    fireEvent.click(screen.getByText('Se déconnecter'));

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });
});