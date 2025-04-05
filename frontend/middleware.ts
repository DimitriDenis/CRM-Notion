import createMiddleware from 'next-intl/middleware';

// Configuration du middleware
export default createMiddleware({
  // Liste des locales supportées
  locales: ['en', 'fr'],
  
  // Locale par défaut
  defaultLocale: 'fr',
  
  // Activer la détection automatique de la locale
  localeDetection: true
});

// Configuration des routes à gérer par le middleware
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 