import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const TWITTER_CLIENT_ID = Deno.env.get('TWITTER_CONSUMER_KEY')!;
const TWITTER_CLIENT_SECRET = Deno.env.get('TWITTER_CONSUMER_SECRET')!;
const CALLBACK_URL = `${SUPABASE_URL}/auth/v1/callback`;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action } = await req.json();
    console.log("Received action:", action);

    if (action === 'connect') {
      // Generate OAuth URL for Twitter
      const state = Math.random().toString(36).substring(7);
      const codeVerifier = Math.random().toString(36).substring(7);
      
      const authUrl = `https://twitter.com/i/oauth2/authorize` +
        `?response_type=code` +
        `&client_id=${encodeURIComponent(TWITTER_CLIENT_ID)}` +
        `&redirect_uri=${encodeURIComponent(CALLBACK_URL)}` +
        `&scope=tweet.read tweet.write users.read offline.access` +
        `&state=${state}` +
        `&code_challenge=${codeVerifier}` +
        `&code_challenge_method=plain`;

      console.log("Generated auth URL:", authUrl);

      return new Response(
        JSON.stringify({ url: authUrl }),
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