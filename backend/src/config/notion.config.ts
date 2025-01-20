// src/config/notion.config.ts
export const notionConfig = {
    development: {
      clientId: process.env.NOTION_OAUTH_CLIENT_ID,
      clientSecret: process.env.NOTION_OAUTH_CLIENT_SECRET,
      redirectUri: 'http://localhost:3000/api/auth/callback/notion',
      appUrl: 'http://localhost:3000',
      privacyUrl: 'http://localhost:3000/legal/privacy',
      termsUrl: 'http://localhost:3000/legal/terms',
    },
    production: {
      clientId: process.env.NOTION_OAUTH_CLIENT_ID,
      clientSecret: process.env.NOTION_OAUTH_CLIENT_SECRET,
      redirectUri: 'https://votre-domaine.com/api/auth/callback/notion',
      appUrl: 'https://votre-domaine.com',
      privacyUrl: 'https://votre-domaine.com/legal/privacy',
      termsUrl: 'https://votre-domaine.com/legal/terms',
    },
  };