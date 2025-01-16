import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateCodeVerifier, generateCodeChallenge } from './pkce.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TWITTER_OAUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const TWITTER_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';
const TWITTER_CLIENT_ID = Deno.env.get('TWITTER_CONSUMER_KEY')?.trim();
const CALLBACK_URL = 'https://preview--pandapost.lovable.app/auth/callback/twitter';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action } = await req.json();
    console.log('Received action:', action);

    if (action === 'connect') {
      console.log('Starting Twitter OAuth flow...');
      
      // Generate PKCE values
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      // Define OAuth parameters
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: TWITTER_CLIENT_ID!,
        redirect_uri: CALLBACK_URL,
        scope: 'tweet.read tweet.write users.read offline.access',
        state: crypto.randomUUID(),
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        force_login: 'true',
      });

      const url = `${TWITTER_OAUTH_URL}?${params.toString()}`;
      console.log('Generated OAuth URL:', url);

      return new Response(
        JSON.stringify({ 
          url,
          state: params.get('state'),
          codeVerifier
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (action === 'callback') {
      const { code, codeVerifier } = await req.json();
      console.log('Processing callback with code:', code);
      
      // Exchange code for tokens
      const tokenResponse = await fetch(TWITTER_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${TWITTER_CLIENT_ID}:`)}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: CALLBACK_URL,
          code_verifier: codeVerifier,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Token exchange failed:', errorText);
        throw new Error(`Token exchange failed: ${errorText}`);
      }

      const tokens = await tokenResponse.json();
      console.log('Received tokens from Twitter');

      // Get user information
      const userResponse = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        console.error('User info fetch failed:', errorText);
        throw new Error(`User info fetch failed: ${errorText}`);
      }

      const userData = await userResponse.json();
      console.log('Retrieved user data from Twitter');

      return new Response(
        JSON.stringify({
          tokens,
          user: userData.data,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    throw new Error(`Unknown action: ${action}`);
  } catch (error) {
    console.error('Error in Twitter function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});