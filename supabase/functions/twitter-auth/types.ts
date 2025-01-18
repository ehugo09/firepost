export interface TwitterAuthResponse {
  oauth_token?: string;
  oauth_token_secret?: string;
  auth_url?: string;
  error?: string;
}

export interface TwitterOAuthConfig {
  consumerKey: string;
  consumerSecret: string;
  callbackUrl: string;
}

export const CALLBACK_URL = "https://app.firepost.co/auth/twitter/callback";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation des clés d'API au démarrage
const config: TwitterOAuthConfig = {
  consumerKey: Deno.env.get("TWITTER_CONSUMER_KEY") || "",
  consumerSecret: Deno.env.get("TWITTER_CONSUMER_SECRET") || "",
  callbackUrl: CALLBACK_URL,
};

if (!config.consumerKey || !config.consumerSecret) {
  throw new Error('Twitter API configuration is incomplete');
}

export { config };