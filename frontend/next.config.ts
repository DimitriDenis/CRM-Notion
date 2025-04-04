import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/auth/callback/notion',
        destination: process.env.NEXT_PUBLIC_API_URL + '/auth/notion/callback' || 'http://localhost:3001/auth/notion/callback',
      }
    ];
  },

  env: {
    NEXT_PUBLIC_NOTION_OAUTH_CLIENT_ID: process.env.NEXT_PUBLIC_NOTION_OAUTH_CLIENT_ID,
  },
  

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
export default nextConfig;