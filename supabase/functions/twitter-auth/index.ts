import { corsHeaders } from './types.ts';
import { getRequestToken, getAccessToken } from './oauth.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, oauth_token, oauth_verifier, user_id } = await req.json();
    console.log('Received request:', { action, oauth_token, oauth_verifier, user_id });

    let response;

    if (action === 'request_token') {
      response = await getRequestToken();
    } else if (action === 'access_token') {
      if (!oauth_token || !oauth_verifier || !user_id) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
      response = await getAccessToken(oauth_token, oauth_verifier, user_id);
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});