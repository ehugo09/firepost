export const TWITTER_CONFIG = {
  clientId: process.env.TWITTER_CLIENT_ID || 'akNKemhMMnZBdlJTYzliRjRtd1o6MTpjaQ',
  redirectUri: 'https://preview--pandapost.lovable.app/auth/callback/twitter',
  scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'].join(' '),
  authUrl: 'https://twitter.com/i/oauth2/authorize',
  // Force Twitter to show auth screen even if user is already authenticated
  forceLogin: true
};