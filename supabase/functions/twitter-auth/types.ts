export interface TwitterAuthResponse {
  oauth_token?: string;
  error?: string;
}

export interface OAuthSignatureParams {
  oauth_consumer_key: string;
  oauth_nonce: string;
  oauth_signature_method: string;
  oauth_timestamp: string;
  oauth_version: string;
  oauth_callback?: string;
  oauth_token?: string;
  oauth_verifier?: string;
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuration
const CALLBACK_URL = "https://app.firepost.co/auth/twitter/callback";

if (!Deno.env.get("TWITTER_CONSUMER_KEY") || !Deno.env.get("TWITTER_CONSUMER_SECRET")) {
  throw new Error('Twitter API configuration is incomplete');
}

export const config = {
  consumerKey: Deno.env.get("TWITTER_CONSUMER_KEY") || "",
  consumerSecret: Deno.env.get("TWITTER_CONSUMER_SECRET") || "",
  callbackUrl: CALLBACK_URL,
};