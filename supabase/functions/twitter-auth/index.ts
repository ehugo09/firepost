import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import * as oauth from "https://esm.sh/oauth4webapi@2.3.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, codeVerifier, redirectUri } = await req.json();
    console.log('Processing token exchange with code:', code);

    if (!code || !codeVerifier) {
      throw new Error('Missing required parameters');
    }

    const TWITTER_CLIENT_ID = Deno.env.get('TWITTER_CLIENT_ID');
    const TWITTER_CLIENT_SECRET = Deno.env.get('TWITTER_CLIENT_SECRET');

    if (!TWITTER_CLIENT_ID || !TWITTER_CLIENT_SECRET) {
      throw new Error('Missing Twitter credentials');
    }

    // Create OAuth client
    const issuer = new URL('https://twitter.com');
    const authorizationServer = new oauth.AuthorizationServer(issuer);
    
    const client: oauth.Client = {
      client_id: TWITTER_CLIENT_ID,
      client_secret: TWITTER_CLIENT_SECRET,
      token_endpoint_auth_method: 'client_secret_basic'
    };

    // Exchange code for tokens
    const response = await oauth.authorizationCodeGrantRequest(
      authorizationServer,
      client,
      { code, code_verifier: codeVerifier, redirect_uri: redirectUri },
      'https://api.twitter.com/2/oauth2/token'
    );

    const tokens = await oauth.processAuthorizationCodeOAuth2Response(
      authorizationServer,
      client,
      response
    );

    if (!tokens.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get user info
    const userResponse = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userData = await userResponse.json();
    console.log('Successfully fetched user info:', userData);

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Store connection in database
    const { error: dbError } = await supabaseAdmin
      .from('social_connections')
      .upsert({
        platform: 'twitter',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token ?? null,
        token_expires_at: tokens.expires_at ? new Date(tokens.expires_at * 1000).toISOString() : null,
        platform_user_id: userData.data.id,
        username: userData.data.username,
        twitter_credentials: {
          id: userData.data.id,
          username: userData.data.username,
          name: userData.data.name,
        },
        user_id: (await req.json()).user.id,
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in Twitter auth function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});