export const TWITTER_CONFIG = {
  clientId: 'akNKemhMMnZBdlJTYzliRjRtd1o6MTpjaQ',
  redirectUri: `${window.location.origin}/auth/callback/twitter`,
  scope: 'tweet.read tweet.write users.read offline.access',
  authUrl: 'https://twitter.com/i/oauth2/authorize'
};