export interface TwitterAuthResponse {
  oauth_token?: string;
  oauth_token_secret?: string;
  auth_url?: string;
  error?: string;
}

export const CALLBACK_URL = "https://app.firepost.co/auth/twitter/callback";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};