// src/components/auth/__tests__/LoginForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { useSearchParams } from 'next/navigation';

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
}));

// Mock de la navigation
const mockWindowLocation = {
  assign: jest.fn(),
  href: '',
};

describe('LoginForm', () => {
  beforeAll(() => {
    // Sauvegarder l'original
    Object.defineProperty(window, 'location', {
      value: { ...mockWindowLocation },
      writable: true,
    });
  });

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
    mockWindowLocation.href = '';
  });

  it('renders login button', () => {
    render(<LoginForm />);
    expect(screen.getByText(/Se connecter avec Notion/i)).toBeInTheDocument();
  });

  it('handles Notion login click', () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByText(/Se connecter avec Notion/i));
    
    // Vérifier l'URL de redirection
    expect(window.location.href).toContain('api.notion.com/v1/oauth/authorize');
    expect(window.location.href).toContain('client_id=');
    expect(window.location.href).toContain('redirect_uri=');
  });

  it('displays error message when error param exists', () => {
    // Mock du paramètre d'erreur
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams('?error=oauth_failed')
    );
    
    render(<LoginForm />);
    
    expect(
      screen.getByText(/L'authentification avec Notion a échoué/i)
    ).toBeInTheDocument();
  });
});