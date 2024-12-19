import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TWITTER_CLIENT_ID = Deno.env.get('TWITTER_CONSUMER_KEY')?.trim();
const TWITTER_CLIENT_SECRET = Deno.env.get('TWITTER_CONSUMER_SECRET')?.trim();

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
      const codeChallenge = codeVerifier; // Using plain method as per Twitter docs
      
      // Use the exact redirect URI provided by Supabase
      const redirectUri = 'https://kyzayqvlqnunzzjtnnsm.supabase.co/auth/v1/callback';
      
      console.log("Using redirect URI:", redirectUri);
      
      // Add required OAuth 2.0 parameters
      const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
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
      
      // Use the same redirect URI as in the connect flow
      const redirectUri = 'https://kyzayqvlqnunzzjtnnsm.supabase.co/auth/v1/callback';
      
      // Exchange code for access token
      const tokenUrl = 'https://api.twitter.com/2/oauth2/token';
      
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
        client_id: TWITTER_CLIENT_ID,
      });

      console.log("Token request params:", params.toString());

      const basicAuth = btoa(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`);
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basicAuth}`
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