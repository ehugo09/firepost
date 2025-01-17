import { createOAuthRequestToken, createOAuth2RequestToken } from './twitter-oauth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: corsHeaders,
      status: 405,
    });
  }

  try {
    const { action } = await req.json();
    console.log('Received action:', action);

    if (action === 'request_token') {
      // Try OAuth 2.0 first
      try {
        console.log('Attempting OAuth 2.0 authentication...');
        const oauth2Token = await createOAuth2RequestToken();
        return new Response(JSON.stringify(oauth2Token), {
          headers: corsHeaders,
          status: 200,
        });
      } catch (oauth2Error) {
        console.log('OAuth 2.0 failed, falling back to OAuth 1.0a:', oauth2Error);
        // Fall back to OAuth 1.0a
        const oauth1Token = await createOAuthRequestToken();
        return new Response(JSON.stringify(oauth1Token), {
          headers: corsHeaders,
          status: 200,
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      headers: corsHeaders,
      status: 400,
    });
  } catch (error) {
    console.error('Error in twitter-auth function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.toString()
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});