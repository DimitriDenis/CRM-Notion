const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.ts'); // Notez l'extension .ts ici

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ne pas exécuter ESLint lors du build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optionnel : ignorer également les erreurs TypeScript
    ignoreBuildErrors: true,
  },
};

module.exports = withNextIntl(nextConfig);