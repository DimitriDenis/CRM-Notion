// src/components/layout/__tests__/MainLayout.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import MainLayout from '../MainLayout';

describe('MainLayout', () => {
  it('renders children content', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('toggles sidebar on mobile', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    const button = screen.getByRole('button', { name: /ouvrir la sidebar/i });
    fireEvent.click(button);
    
    // Vérifier que la sidebar est visible
    expect(document.querySelector('[role="dialog"]')).toBeInTheDocument();
  });
});