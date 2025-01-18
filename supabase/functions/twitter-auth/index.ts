import { corsHeaders, TwitterAuthResponse } from './types.ts';
import { getRequestToken } from './oauth.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
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

    const response: TwitterAuthResponse = await getRequestToken();
    console.log('Sending response:', response);

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