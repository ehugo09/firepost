import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const TWITTER_CLIENT_ID = Deno.env.get('TWITTER_CONSUMER_KEY')?.trim();
const TWITTER_CLIENT_SECRET = Deno.env.get('TWITTER_CONSUMER_SECRET')?.trim();

// Initialize Supabase client with service role key for admin access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify environment variables
    if (!TWITTER_CLIENT_ID || !TWITTER_CLIENT_SECRET) {
      console.error("Missing Twitter credentials");
      throw new Error("Twitter credentials not configured");
    }

    const { action, code, state } = await req.json();
    console.log("Received request:", { action, code, state });

    if (action === 'connect') {
      // Generate OAuth URL for Twitter
      const state = crypto.randomUUID();
      const codeVerifier = crypto.randomUUID();
      const codeChallenge = codeVerifier; // For simplicity, using plain method
      
      // Store the code verifier in the session for later use
      const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
      const redirectUri = new URL('/auth/callback/twitter', SUPABASE_URL).toString();
      
      console.log("Redirect URI:", redirectUri);
      
      // Add all required parameters
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: TWITTER_CLIENT_ID,
        redirect_uri: redirectUri,
        scope: 'tweet.read tweet.write users.read offline.access',
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'plain'
      });
      
      authUrl.search = params.toString();
      console.log("Generated auth URL:", authUrl.toString());

      return new Response(
        JSON.stringify({ 
          url: authUrl.toString(),
          state,
          codeVerifier
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
        },
      );
    } else if (action === 'callback') {
      if (!code) {
        throw new Error('No code provided');
      }

      // Exchange the code for access token
      const tokenUrl = 'https://api.twitter.com/2/oauth2/token';
      const redirectUri = new URL('/auth/callback/twitter', SUPABASE_URL).toString();
      
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: state // We're using the state as code verifier for simplicity
      });

      console.log("Token request params:", params.toString());

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`)}`
        },
        body: params
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Token exchange failed:", errorText);
        throw new Error(`Failed to exchange code: ${errorText}`);
      }

      const tokenData = await response.json();
      console.log("Received token data:", tokenData);

      // Get user info
      const userResponse = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        console.error("User info request failed:", errorText);
        throw new Error(`Failed to get user info: ${errorText}`);
      }

      const userData = await userResponse.json();
      console.log("Received user data:", userData);

      return new Response(
        JSON.stringify({ success: true, user: userData.data }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});