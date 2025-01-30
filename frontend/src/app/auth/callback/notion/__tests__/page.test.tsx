// src/app/auth/callback/notion/__tests__/page.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import NotionCallbackPage from '../page';
import { handleNotionCallback } from '@/lib/api/auth';

jest.mock('next/navigation', () => ({
 useRouter: () => ({ push: jest.fn() }),
 useSearchParams: () => new URLSearchParams('?code=test-code')
}));

jest.mock('@/lib/api/auth', () => ({
 handleNotionCallback: jest.fn()
}));

describe('NotionCallbackPage', () => {
 beforeEach(() => {
   localStorage.clear();
   (handleNotionCallback as jest.Mock).mockClear();
 });

 it('shows loading state', () => {
   render(<NotionCallbackPage />);
   expect(screen.getByText(/Connexion en cours/i)).toBeInTheDocument();
 });

 it('handles successful callback', async () => {
   (handleNotionCallback as jest.Mock).mockResolvedValue({ token: 'test-token' });
   
   render(<NotionCallbackPage />);
   
   await waitFor(() => {
     expect(handleNotionCallback).toHaveBeenCalledWith('test-code');
     expect(localStorage.getItem('token')).toBe('test-token');
   });
 });

 it('handles callback error', async () => {
   (handleNotionCallback as jest.Mock).mockRejectedValue(new Error('Failed'));
   
   render(<NotionCallbackPage />);
   
   await waitFor(() => {
     expect(handleNotionCallback).toHaveBeenCalledWith('test-code');
     expect(localStorage.getItem('token')).toBeNull();
   });
 });
});