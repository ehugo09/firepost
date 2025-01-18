export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CALLBACK_URL = "https://app.firepost.co/auth/twitter/callback";

if (!Deno.env.get("TWITTER_CONSUMER_KEY") || !Deno.env.get("TWITTER_CONSUMER_SECRET")) {
  throw new Error('Twitter API configuration is incomplete');
}

export const config = {
  consumerKey: Deno.env.get("TWITTER_CONSUMER_KEY") || "",
  consumerSecret: Deno.env.get("TWITTER_CONSUMER_SECRET") || "",
  callbackUrl: CALLBACK_URL,
};