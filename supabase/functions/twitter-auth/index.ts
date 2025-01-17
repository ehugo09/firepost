import { createOAuthRequestToken } from './twitter-oauth1.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: corsHeaders,
      status: 405,
    });
  }

  try {
    const { action } = await req.json();

    if (action === 'request_token') {
      const requestToken = await createOAuthRequestToken();
      return new Response(JSON.stringify(requestToken), {
        headers: corsHeaders,
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      headers: corsHeaders,
      status: 400,
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.toString()
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});