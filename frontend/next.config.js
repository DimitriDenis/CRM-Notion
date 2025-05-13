const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.ts'); // Notez l'extension .ts ici

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... autres configurations existantes
};

module.exports = withNextIntl(nextConfig);