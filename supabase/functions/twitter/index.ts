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

    const { action, code, codeVerifier } = await req.json();
    console.log("Received request:", { action, code: code ? "present" : "absent" });

    if (action === 'connect') {
      // Generate OAuth URL for Twitter
      const state = crypto.randomUUID();
      const codeVerifier = crypto.randomUUID();
      const codeChallenge = codeVerifier; // For simplicity, using plain method
      
      const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
      const redirectUri = new URL('/auth/callback/twitter', SUPABASE_URL).toString();
      
      console.log("Generated redirect URI:", redirectUri);
      
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
        console.error("No code provided in callback");
        throw new Error('No code provided');
      }

      console.log("Processing callback with code");
      
      // Exchange the code for access token
      const tokenUrl = 'https://api.twitter.com/2/oauth2/token';
      const redirectUri = new URL('/auth/callback/twitter', SUPABASE_URL).toString();
      
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
        client_id: TWITTER_CLIENT_ID,
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

      const responseText = await response.text();
      console.log("Token response:", responseText);

      if (!response.ok) {
        console.error("Token exchange failed:", responseText);
        throw new Error(`Failed to exchange code: ${responseText}`);
      }

      const tokenData = JSON.parse(responseText);
      console.log("Parsed token data:", tokenData);

      // Get user info
      const userResponse = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });

      const userResponseText = await userResponse.text();
      console.log("User info response:", userResponseText);

      if (!userResponse.ok) {
        console.error("User info request failed:", userResponseText);
        throw new Error(`Failed to get user info: ${userResponseText}`);
      }

      const userData = JSON.parse(userResponseText);
      console.log("Parsed user data:", userData);

      return new Response(
        JSON.stringify({ 
          success: true, 
          user: userData.data,
          tokens: tokenData
        }),
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