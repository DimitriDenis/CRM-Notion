import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Liste des locales supportées
  locales: ['en', 'fr'],

  // Locale par défaut
  defaultLocale: 'fr'
});

export const config = {
  // Matcher pour les routes qui doivent être gérées par le middleware
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 