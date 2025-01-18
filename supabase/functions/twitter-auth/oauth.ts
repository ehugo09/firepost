import { config } from './types.ts';

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
    console.log('Making request to Twitter with auth header:', authHeader);
    
    const response = await fetch(`${TWITTER_API_URL}/request_token`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twitter API error:', response.status, errorText);
      throw new Error(`Twitter API error: ${response.status} - ${errorText}`);
    }

    const text = await response.text();
    console.log('Raw Twitter response:', text);
    
    const params = new URLSearchParams(text);
    return Object.fromEntries(params.entries());
  } catch (error) {
    console.error('Error in getRequestToken:', error);
    throw error;
  }
}