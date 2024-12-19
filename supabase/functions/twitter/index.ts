import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TWITTER_CLIENT_ID = Deno.env.get('TWITTER_CONSUMER_KEY')?.trim();
const TWITTER_CLIENT_SECRET = Deno.env.get('TWITTER_CONSUMER_SECRET')?.trim();
const CALLBACK_URL = `${Deno.env.get('SUPABASE_URL')}/auth/v1/callback`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log request details
    console.log("Request method:", req.method);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));

    const { action } = await req.json();
    console.log("Received action:", action);

    // Verify environment variables
    if (!TWITTER_CLIENT_ID || !TWITTER_CLIENT_SECRET) {
      console.error("Missing Twitter credentials");
      throw new Error("Twitter credentials not configured");
    }

    if (action === 'connect') {
      // Generate OAuth URL for Twitter
      const state = crypto.randomUUID();
      const codeVerifier = crypto.randomUUID();
      const codeChallenge = codeVerifier; // For simplicity, using plain method
      
      console.log("Generated state:", state);
      console.log("Generated code verifier:", codeVerifier);
      console.log("Callback URL:", CALLBACK_URL);
      
      const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
      
      // Add all required parameters
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: TWITTER_CLIENT_ID,
        redirect_uri: CALLBACK_URL,
        scope: 'tweet.read tweet.write users.read offline.access',
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'plain'
      });
      
      authUrl.search = params.toString();
      
      console.log("Generated auth URL:", authUrl.toString());

      return new Response(
        JSON.stringify({ url: authUrl.toString() }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
        },
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