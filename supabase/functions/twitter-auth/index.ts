import { createOAuthRequestToken, createOAuthAccessToken, verifyCredentials } from './twitter-oauth1.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, oauth_token, oauth_verifier } = await req.json();
    console.log('Twitter auth function called with action:', action);

    if (action === 'request_token') {
      console.log('Requesting OAuth token...');
      const requestToken = await createOAuthRequestToken();
      return new Response(JSON.stringify(requestToken), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'access_token') {
      if (!oauth_token || !oauth_verifier) {
        throw new Error('Missing oauth_token or oauth_verifier');
      }

      console.log('Getting access token...');
      const accessToken = await createOAuthAccessToken(oauth_token, oauth_verifier);
      const userInfo = await verifyCredentials(accessToken.oauth_token, accessToken.oauth_token_secret);

      return new Response(JSON.stringify({ accessToken, userInfo }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error in twitter-auth function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});