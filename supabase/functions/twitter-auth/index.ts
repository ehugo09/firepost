import { createOAuthRequestToken, createOAuthAccessToken, verifyCredentials } from './twitter-oauth1.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    if (req.method !== 'POST') {
      console.error('Invalid method:', req.method);
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        headers: corsHeaders,
        status: 405,
      });
    }

    console.log('Parsing request body...');
    const { action, oauth_token, oauth_verifier, user_id } = await req.json();
    console.log('Request parameters:', { action, oauth_token, oauth_verifier, user_id });

    if (action === 'request_token') {
      console.log('Initiating OAuth request token flow');
      try {
        const requestToken = await createOAuthRequestToken();
        console.log('Successfully obtained request token:', requestToken);
        return new Response(JSON.stringify(requestToken), {
          headers: corsHeaders,
          status: 200,
        });
      } catch (error) {
        console.error('Failed to get request token:', error);
        return new Response(JSON.stringify({ 
          error: `Authentication failed: ${error.message}`,
          details: error.toString()
        }), {
          headers: corsHeaders,
          status: 400,
        });
      }
    }

    if (action === 'access_token') {
      if (!oauth_token || !oauth_verifier || !user_id) {
        console.error('Missing required parameters:', { oauth_token, oauth_verifier, user_id });
        return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
          headers: corsHeaders,
          status: 400,
        });
      }

      console.log('Starting OAuth access token process...');
      try {
        const accessToken = await createOAuthAccessToken(oauth_token, oauth_verifier);
        console.log('Successfully obtained access token');
        
        const userInfo = await verifyCredentials(accessToken.oauth_token, accessToken.oauth_token_secret);
        console.log('Successfully verified credentials');

        // Create Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Save connection to database
        const { error: dbError } = await supabase
          .from('social_connections')
          .upsert({
            user_id,
            platform: 'twitter',
            access_token: accessToken.oauth_token,
            refresh_token: accessToken.oauth_token_secret,
            platform_user_id: userInfo.id_str,
            username: userInfo.screen_name,
            profile_picture: userInfo.profile_image_url_https,
            twitter_credentials: {
              id: userInfo.id_str,
              username: userInfo.screen_name,
              name: userInfo.name,
            },
          }, {
            onConflict: 'user_id,platform'
          });

        if (dbError) {
          console.error('Database error:', dbError);
          return new Response(JSON.stringify({ error: 'Database error' }), {
            headers: corsHeaders,
            status: 500,
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: corsHeaders,
          status: 200,
        });
      } catch (error) {
        console.error('Error in access token process:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          headers: corsHeaders,
          status: 400,
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