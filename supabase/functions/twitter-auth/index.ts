import { corsHeaders, TwitterAuthResponse } from './types.ts';
import { handleOAuth2Request } from './oauth2.ts';
import { handleOAuth1Request } from './oauth1.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );
  }

  try {
    const { action } = await req.json();
    console.log('Received action:', action);

    if (action !== 'request_token') {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    let response: TwitterAuthResponse;

    try {
      // Essayer OAuth 2.0 d'abord
      response = await handleOAuth2Request();
    } catch (oauth2Error) {
      console.log('OAuth 2.0 failed, falling back to OAuth 1.0a:', oauth2Error);
      // Si OAuth 2.0 échoue, essayer OAuth 1.0a
      response = await handleOAuth1Request();
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in twitter-auth function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});