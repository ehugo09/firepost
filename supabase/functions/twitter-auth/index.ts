import { createOAuthRequestToken, createOAuthAccessToken, verifyCredentials } from './twitter-oauth1.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, oauth_token, oauth_verifier } = await req.json();
    console.log('Twitter auth function called with action:', action);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));

    if (action === 'request_token') {
      console.log('Starting OAuth request token process...');
      try {
        const requestToken = await createOAuthRequestToken();
        console.log('Successfully obtained request token:', requestToken);
        return new Response(JSON.stringify(requestToken), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error getting request token:', error);
        throw error;
      }
    }

    if (action === 'access_token') {
      if (!oauth_token || !oauth_verifier) {
        console.error('Missing required parameters:', { oauth_token, oauth_verifier });
        throw new Error('Missing oauth_token or oauth_verifier');
      }

      console.log('Starting OAuth access token process...');
      try {
        const accessToken = await createOAuthAccessToken(oauth_token, oauth_verifier);
        console.log('Successfully obtained access token');
        const userInfo = await verifyCredentials(accessToken.oauth_token, accessToken.oauth_token_secret);
        console.log('Successfully verified credentials');

        return new Response(JSON.stringify({ accessToken, userInfo }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error in access token process:', error);
        throw error;
      }
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error in twitter-auth function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString(),
        stack: error.stack
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});