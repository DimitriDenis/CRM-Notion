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
};
export default nextConfig;