export const TWITTER_CONFIG = {
  apiKey: import.meta.env.VITE_TWITTER_API_KEY || '',
  apiSecretKey: import.meta.env.VITE_TWITTER_API_SECRET_KEY || '',
  callbackUrl: import.meta.env.VITE_TWITTER_CALLBACK_URL || 'https://preview--pandapost.lovable.app/auth/callback/twitter'
};