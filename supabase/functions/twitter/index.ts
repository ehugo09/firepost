import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    const { action, code, codeVerifier } = await req.json();
    console.log('Received request with action:', action);
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    
    // Validate environment variables
    const envCheck = {
      hasConsumerKey: !!Deno.env.get('TWITTER_CONSUMER_KEY'),
      hasConsumerSecret: !!Deno.env.get('TWITTER_CONSUMER_SECRET'),
    };
    console.log('Environment check:', envCheck);

    if (!envCheck.hasConsumerKey || !envCheck.hasConsumerSecret) {
      throw new Error('Missing required Twitter API credentials');
    }

    if (action === 'connect') {
      const state = crypto.randomUUID();
      const newCodeVerifier = crypto.randomUUID();
      const challenge = newCodeVerifier; // For Twitter, the challenge is the same as verifier

      // Use the callback URL from Twitter Developer Portal
      const redirectUri = 'https://kyzayqvlqnunzzjtnnsm.supabase.co/auth/v1/callback';
      
      console.log('Starting OAuth flow with:', {
        state,
        codeVerifier: newCodeVerifier,
        redirectUri
      });

      const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('client_id', Deno.env.get('TWITTER_CONSUMER_KEY')!);
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('scope', 'tweet.read tweet.write users.read offline.access');
      authUrl.searchParams.append('state', state);
      authUrl.searchParams.append('code_challenge', challenge);
      authUrl.searchParams.append('code_challenge_method', 'plain');

      console.log('Generated auth URL:', authUrl.toString());

      return new Response(
        JSON.stringify({
          url: authUrl.toString(),
          state,
          codeVerifier: newCodeVerifier,
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    if (action === 'callback') {
      console.log('Processing callback with:', {
        code: code ? 'present' : 'missing',
        codeVerifier: codeVerifier ? 'present' : 'missing'
      });
      
      if (!code || !codeVerifier) {
        throw new Error('Missing required parameters for callback');
      }

      const redirectUri = 'https://kyzayqvlqnunzzjtnnsm.supabase.co/auth/v1/callback';
      
      console.log('Preparing token exchange with:', {
        redirectUri,
        codeVerifier
      });

      const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${Deno.env.get('TWITTER_CONSUMER_KEY')}:${Deno.env.get('TWITTER_CONSUMER_SECRET')}`)}`,
        },
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
      });

      const tokenResponseText = await tokenResponse.text();
      console.log('Token response status:', tokenResponse.status);
      console.log('Token response headers:', Object.fromEntries(tokenResponse.headers));
      
      let tokens;
      try {
        tokens = JSON.parse(tokenResponseText);
        console.log('Parsed token response:', {
          hasAccessToken: !!tokens.access_token,
          hasRefreshToken: !!tokens.refresh_token,
          tokenType: tokens.token_type,
          error: tokens.error,
          errorDescription: tokens.error_description
        });
      } catch (error) {
        console.error('Failed to parse token response:', tokenResponseText);
        throw new Error(`Token exchange failed: ${tokenResponseText}`);
      }

      if (!tokenResponse.ok || tokens.error) {
        console.error('Token exchange failed:', tokens.error_description || tokenResponseText);
        throw new Error(`Token exchange failed: ${tokens.error_description || tokenResponseText}`);
      }

      // Get user information
      console.log('Fetching user information with access token');
      const userResponse = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        console.error('User info fetch failed:', errorText);
        throw new Error(`Failed to fetch user info: ${errorText}`);
      }

      const userData = await userResponse.json();
      console.log('Received user data:', {
        id: userData.data.id,
        username: userData.data.username,
        data: userData.data
      });

      return new Response(
        JSON.stringify({
          tokens,
          user: userData.data,
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    throw new Error('Invalid action');
  } catch (error: any) {
    console.error('Error in Twitter function:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        type: error.constructor.name
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});