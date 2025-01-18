import { TwitterAuthResponse, config, corsHeaders } from './types.ts';
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

function generateNonce(length = 32) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

function generateTimestamp() {
  return Math.floor(Date.now() / 1000).toString();
}

// Implémentation RFC3986 complète
function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
    .replace(/[^A-Za-z0-9\-._~]/g, (c) => 
      `%${c.charCodeAt(0).toString(16).toUpperCase()}`
    );
}

export async function handleOAuth1Request(): Promise<TwitterAuthResponse> {
  console.log('Starting OAuth 1.0a request token process');

  const oauth = {
    oauth_consumer_key: config.consumerKey,
    oauth_nonce: generateNonce(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: generateTimestamp(),
    oauth_version: '1.0',
    oauth_callback: config.callbackUrl,
  };

  const baseUrl = 'https://api.twitter.com/oauth/request_token';
  console.log('Using base URL:', baseUrl);
  
  // Encode chaque composant séparément avant de construire la clé de signature
  const signingKey = `${percentEncode(config.consumerSecret)}&`;

  // Trier et encoder les paramètres selon RFC3986
  const parameters = Object.entries(oauth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${percentEncode(key)}=${percentEncode(value)}`)
    .join('&');

  console.log('Parameters before encoding:', parameters);

  // Construction de la base string selon RFC3986
  const signatureBaseString = [
    'POST',
    percentEncode(baseUrl),
    percentEncode(parameters)
  ].join('&');

  console.log('Signature base string:', signatureBaseString);

  const signature = createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');

  console.log('Generated signature:', signature);

  // Construction de l'en-tête d'autorisation avec encodage RFC3986
  const authHeader = 'OAuth ' + Object.entries(oauth)
    .map(([key, value]) => `${percentEncode(key)}="${percentEncode(value)}"`)
    .concat([`oauth_signature="${percentEncode(signature)}"`])
    .join(', ');

  console.log('Authorization header:', authHeader);

  try {
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
    const oauth_token_secret = params.get('oauth_token_secret');

    if (!oauth_token) {
      throw new Error('No oauth_token in response');
    }

    console.log('OAuth 1.0a request successful:', { oauth_token });

    return {
      oauth_token,
      oauth_token_secret: oauth_token_secret || undefined,
    };
  } catch (error) {
    console.error('OAuth 1.0a request failed:', error);
    throw error;
  }
}