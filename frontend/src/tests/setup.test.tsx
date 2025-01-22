// src/tests/setup.test.tsx
import { render, screen } from '@testing-library/react'
import RootLayout from '../app/layout'
import '@testing-library/jest-dom';

describe('Initial Setup', () => {
  it('renders layout correctly', () => {
    render(<RootLayout>Test Content</RootLayout>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })
})