export const TWITTER_CONFIG = {
  clientId: import.meta.env.VITE_TWITTER_CLIENT_ID || 'akNKemhMMnZBdlJTYzliRjRtd1o6MTpjaQ',
  redirectUri: import.meta.env.VITE_TWITTER_REDIRECT_URI || 'https://preview--pandapost.lovable.app/auth/callback/twitter',
  scope: 'tweet.read tweet.write users.read offline.access',
  authUrl: 'https://twitter.com/i/oauth2/authorize',
  forceLogin: true
};