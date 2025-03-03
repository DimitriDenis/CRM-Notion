// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('=== Middleware Executing ===');
  
  // 1. Vérifier si le token est dans l'URL
  const urlToken = request.nextUrl.searchParams.get('token');
  if (urlToken) {
    console.log('Token trouvé dans l\'URL');
    
    // Créer une réponse qui définit un cookie avec le token
    const response = NextResponse.redirect(
      // Rediriger vers la même URL mais sans le paramètre token
      new URL(request.nextUrl.pathname, request.url)
    );
    
    // Définir le cookie pour les futures requêtes
    response.cookies.set({
      name: 'token',
      value: urlToken,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      httpOnly: false, // Permettre l'accès côté client
      sameSite: 'lax'
    });
    
    console.log('Cookie défini et redirection effectuée');
    return response;
  }
  
  // 2. Vérifier si le token est dans les cookies
  const cookieToken = request.cookies.get('token');
  
  // 3. Logique de redirection basée sur l'authentification
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/');
  
  if (isAuthPage && cookieToken) {
    // Si on est sur une page d'auth et qu'on a un token, rediriger vers dashboard
    console.log('Redirection de page auth vers dashboard (token trouvé)');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (!isAuthPage && !cookieToken) {
    // Si on n'est pas sur une page d'auth et qu'on n'a pas de token, rediriger vers login
    console.log('Redirection vers login (pas de token)');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // 4. Si tout est en ordre, continuer normalement
  console.log('Middleware: Autorisation OK');
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};