// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const urlToken = request.nextUrl.searchParams.get('token');
  
  // Si on a un token dans l'URL, créer un nouveau Response avec le cookie
  if (urlToken) {
    const response = NextResponse.next();
    response.cookies.set('token', urlToken, {
      httpOnly: false,
      path: '/',
      sameSite: 'lax'
    });
    return response;
  }

  // Si on a un token dans les cookies ou dans l'URL et qu'on est sur une page d'auth
  if (request.nextUrl.pathname.startsWith('/auth/') && (token || urlToken)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Si on n'a pas de token (ni cookie ni URL) et qu'on n'est pas sur une page d'auth
  if (!request.nextUrl.pathname.startsWith('/auth/') && !token && !urlToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};