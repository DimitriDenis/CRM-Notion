// src/components/layout/__tests__/Sidebar.test.tsx
import { render, screen } from '@testing-library/react';
import { Sidebar } from '../Sidebar';

describe('Sidebar', () => {
  const mockSetIsOpen = jest.fn();

  it('renders sidebar content', () => {
    render(<Sidebar isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    expect(screen.getByAltText('NotionCRM')).toBeInTheDocument();
  });

  it('shows mobile sidebar when isOpen is true', () => {
    render(<Sidebar isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    expect(document.querySelector('[role="dialog"]')).toBeInTheDocument();
  });

  it('hides mobile sidebar when isOpen is false', () => {
    render(<Sidebar isOpen={false} setIsOpen={mockSetIsOpen} />);
    
    expect(document.querySelector('[role="dialog"]')).not.toBeVisible();
  });
});