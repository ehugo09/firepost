import { config, TwitterAuthResponse } from './types.ts';
import { 
  generateNonce, 
  generateTimestamp, 
  createSignature, 
  createAuthorizationHeader 
} from './utils.ts';

export async function getRequestToken(): Promise<TwitterAuthResponse> {
  const baseUrl = 'https://api.twitter.com/oauth/request_token';
  
  console.log('Starting OAuth request token process');

  try {
    // 1. Préparer les paramètres OAuth
    const oauthParams = {
      oauth_consumer_key: config.consumerKey,
      oauth_nonce: generateNonce(),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: generateTimestamp(),
      oauth_version: '1.0',
      oauth_callback: config.callbackUrl,
    };

    console.log('OAuth parameters prepared:', oauthParams);

    // 2. Créer la signature
    const signature = createSignature(
      'POST',
      baseUrl,
      oauthParams,
      config.consumerSecret
    );

    console.log('Signature generated');

    // 3. Créer l'en-tête d'autorisation
    const authHeader = createAuthorizationHeader(oauthParams, signature);

    console.log('Authorization header created');

    // 4. Faire la requête
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twitter API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const text = await response.text();
    console.log('Twitter API response:', text);
    
    const params = new URLSearchParams(text);
    const oauth_token = params.get('oauth_token');

    if (!oauth_token) {
      throw new Error('No oauth_token in response');
    }

    console.log('Request token obtained successfully');

    return { oauth_token };
  } catch (error) {
    console.error('Error getting request token:', error);
    return { error: error.message };
  }
}