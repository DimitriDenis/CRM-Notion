export const appConfig = () => ({
    port: parseInt(process.env.PORT, 10) || 3001,
    jwtSecret: process.env.JWT_SECRET,
    notion: {
      clientId: process.env.NOTION_OAUTH_CLIENT_ID,
      clientSecret: process.env.NOTION_OAUTH_CLIENT_SECRET,
      redirectUri: process.env.NOTION_OAUTH_REDIRECT_URI,
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
  });