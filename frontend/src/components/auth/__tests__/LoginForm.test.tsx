// src/components/auth/__tests__/LoginForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams())
}));

describe('LoginForm', () => {
  const originalWindowLocation = window.location;

  beforeEach(() => {
    // Réinitialiser le mock de window.location
    window.location = {
      ...originalWindowLocation,
      href: 'http://localhost:3000',
      origin: 'http://localhost:3000'
    };
  });

  afterAll(() => {
    window.location = originalWindowLocation; // Restaurer l'original
  });

  it('renders login button', () => {
    render(<LoginForm />);
    expect(screen.getByText(/Se connecter avec Notion/i)).toBeInTheDocument();
  });

  it('handles Notion login click', () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByText(/Se connecter avec Notion/i));
    
    // Vérifie que href a été modifié
    expect(window.location.href).toContain('api.notion.com/v1/oauth/authorize');
    expect(window.location.href).toContain('client_id=');
    expect(window.location.href).toContain('redirect_uri=');
  });

  it('displays error message when error param exists', () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('?error=oauth_failed'));
    render(<LoginForm />);
    
    expect(screen.getByText(/L'authentification avec Notion a échoué/i)).toBeInTheDocument();
  });
});