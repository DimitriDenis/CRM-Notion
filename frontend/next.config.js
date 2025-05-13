const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... autres configurations existantes
};

module.exports = withNextIntl(nextConfig); 