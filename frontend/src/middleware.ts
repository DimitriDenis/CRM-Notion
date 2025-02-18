// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const hasTokenInUrl = request.nextUrl.searchParams.has('token');

  // Si on a un token dans les cookies ou dans l'URL et qu'on est sur une page d'auth
  if (request.nextUrl.pathname.startsWith('/auth/') && (token || hasTokenInUrl)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Si on n'a pas de token (ni cookie ni URL) et qu'on n'est pas sur une page d'auth
  if (!request.nextUrl.pathname.startsWith('/auth/') && !token && !hasTokenInUrl) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};