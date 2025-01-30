// src/tests/setup.test.tsx
import { render, screen } from '@testing-library/react'
import { TestWrapper } from './test-utils'

describe('Initial Setup', () => {
  it('renders content correctly', () => {
    render(
      <TestWrapper>
        Test Content
      </TestWrapper>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })
})