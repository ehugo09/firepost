import { corsHeaders } from './types.ts';
import { getRequestToken, getAccessToken } from './oauth.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, oauth_token, oauth_verifier, user_id } = await req.json();
    console.log('Received request:', { action, oauth_token, oauth_verifier, user_id });

    if (action === 'request_token') {
      const response = await getRequestToken();
      console.log('Request token response:', response);
      return new Response(
        JSON.stringify(response),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'access_token') {
      if (!oauth_token || !oauth_verifier || !user_id) {
        console.error('Missing required parameters for access_token action');
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      console.log('Processing access_token request...');
      const response = await getAccessToken(oauth_token, oauth_verifier);
      console.log('Access token response:', response);

      // Create Supabase client
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // Insert into social_connections table
      console.log('Attempting to insert into social_connections...');
      const { data: insertData, error: insertError } = await supabaseClient
        .from('social_connections')
        .insert({
          user_id: user_id,
          platform: 'twitter',
          access_token: response.oauth_token,
          twitter_credentials: response
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting social connection:', insertError);
        throw insertError;
      }

      console.log('Successfully inserted social connection:', insertData);
      
      return new Response(
        JSON.stringify(response),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );

  } catch (error) {
    console.error('Error in twitter-auth function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});