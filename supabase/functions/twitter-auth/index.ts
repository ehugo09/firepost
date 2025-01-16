import { createOAuthRequestToken, createOAuthAccessToken, verifyCredentials } from './twitter-oauth1.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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
    const { action, oauth_token, oauth_verifier, user_id } = await req.json();
    console.log('Twitter auth function called with:', { action, oauth_token, oauth_verifier, user_id });

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
      if (!oauth_token || !oauth_verifier || !user_id) {
        console.error('Missing required parameters:', { oauth_token, oauth_verifier, user_id });
        throw new Error('Missing required parameters');
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
          });

        if (dbError) {
          console.error('Database error:', dbError);
          throw dbError;
        }

        return new Response(JSON.stringify({ success: true }), {
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
        details: error.toString()
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});