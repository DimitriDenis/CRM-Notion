// src/tests/test-utils.tsx
import { ReactNode } from 'react'

export function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="test-wrapper">
      {children}
    </div>
  )
}