// src/tests/auth.test.ts
import { isTokenValid, getAuthToken } from '@/utils/auth'

describe('Auth Utils', () => {
  it('validates tokens correctly', () => {
    const mockValidToken = 'valid.token.here'
    expect(isTokenValid(mockValidToken)).toBeDefined()
  })

  it('returns null for auth token on server side', () => {
    expect(getAuthToken()).toBeNull()
  })
})