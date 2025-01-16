import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { generateCodeVerifier, generateCodeChallenge } from './pkce.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TWITTER_OAUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const TWITTER_CLIENT_ID = Deno.env.get('TWITTER_CONSUMER_KEY')?.trim();

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
        redirect_uri: 'https://kyzayqvlqnunzzjtnnsm.supabase.co/functions/v1/twitter/callback',
        scope: 'tweet.read tweet.write users.read offline.access',
        state: crypto.randomUUID(),
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        force_login: 'true', // Force Twitter to show the login screen
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

    // Handle callback
    const { code, state } = await req.json();
    console.log('Handling callback with code:', code, 'and state:', state);

    // Verify state matches
    const storedState = localStorage.getItem('twitter_oauth_state');
    console.log("Comparing states:", { stored: storedState, received: state });
    
    if (state !== storedState) {
      console.error("State mismatch:", { stored: storedState, received: state });
      throw new Error('Invalid state parameter');
    }

    // Exchange code for token
    console.log("Exchanging code for token...");
    const { data: callbackData, error: callbackError } = await supabase.functions.invoke('twitter', {
      body: { 
        action: 'callback',
        code,
        codeVerifier: localStorage.getItem('twitter_code_verifier')
      }
    });

    if (callbackError) {
      console.error("Callback error:", callbackError);
      throw callbackError;
    }

    console.log("Received callback data:", callbackData);

    // Save connection to database
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error("No active session found");
      throw new Error('No active session');
    }

    console.log("Saving connection to database...");
    const { error: insertError } = await supabase
      .from('social_connections')
      .upsert({
        user_id: session.user.id,
        platform: 'twitter',
        username: callbackData.user.username,
        platform_user_id: callbackData.user.id,
        twitter_credentials: callbackData.tokens
      });

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw insertError;
    }

    // Clean up
    localStorage.removeItem('twitter_oauth_state');
    localStorage.removeItem('twitter_code_verifier');

    console.log("Twitter connection successful:", callbackData);
    toast.success("Successfully connected to Twitter!");

    return callbackData;
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
