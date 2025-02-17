import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/auth/callback/notion',
        destination: 'http://localhost:3001/auth/notion/callback',
      }
    ];
  },

  env: {
    NEXT_PUBLIC_NOTION_OAUTH_CLIENT_ID: process.env.NEXT_PUBLIC_NOTION_OAUTH_CLIENT_ID,
  },
};
export default nextConfig;