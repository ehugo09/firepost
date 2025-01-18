import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { config, corsHeaders } from './types.ts';

const TWITTER_API_URL = 'https://api.twitter.com/oauth';

export async function getRequestToken(): Promise<any> {
  console.log('Starting OAuth request token process');
  
  const oauthParams = {
    oauth_callback: config.callbackUrl,
    oauth_consumer_key: config.consumerKey,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_version: '1.0'
  };

  const authHeader = `OAuth oauth_callback="${encodeURIComponent(config.callbackUrl)}", oauth_consumer_key="${config.consumerKey}", oauth_nonce="${oauthParams.oauth_nonce}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${oauthParams.oauth_timestamp}", oauth_version="1.0"`;

  try {
    const response = await fetch(`${TWITTER_API_URL}/request_token`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      }
    });

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status}`);
    }

    const text = await response.text();
    const params = new URLSearchParams(text);
    const oauth_token = params.get('oauth_token');

    if (!oauth_token) {
      throw new Error('No oauth_token in response');
    }

    return { oauth_token };
  } catch (error) {
    console.error('Error in getRequestToken:', error);
    throw error;
  }
}

export async function getAccessToken(oauth_token: string, oauth_verifier: string, user_id: string): Promise<any> {
  console.log('Starting access token process');
  
  try {
    const authHeader = `OAuth oauth_consumer_key="${config.consumerKey}", oauth_token="${oauth_token}", oauth_verifier="${oauth_verifier}"`;

    const response = await fetch(`${TWITTER_API_URL}/access_token`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      }
    });

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status}`);
    }

    const text = await response.text();
    const params = new URLSearchParams(text);
    
    const access_token = params.get('oauth_token');
    const access_token_secret = params.get('oauth_token_secret');
    const screen_name = params.get('screen_name');
    const user_id_str = params.get('user_id');

    if (!access_token || !access_token_secret) {
      throw new Error('Missing tokens in response');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase
      .from('social_connections')
      .upsert({
        user_id: user_id,
        platform: 'twitter',
        username: screen_name,
        platform_user_id: user_id_str,
        twitter_credentials: {
          access_token,
          access_token_secret
        }
      }, {
        onConflict: 'user_id,platform'
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error in getAccessToken:', error);
    throw error;
  }
}