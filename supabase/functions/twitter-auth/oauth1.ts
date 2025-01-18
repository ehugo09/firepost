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

function percentEncode(str: string) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/\*/g, '%2A')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

export async function handleOAuth1Request(): Promise<TwitterAuthResponse> {
  console.log('Starting OAuth 1.0a request token process');

  const oauth = {
    oauth_consumer_key: config.consumerKey,
    oauth_nonce: generateNonce(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: generateTimestamp(),
    oauth_version: '1.0',
    oauth_callback: percentEncode(config.callbackUrl),
  };

  const baseUrl = 'https://api.twitter.com/oauth/request_token';
  const signingKey = `${percentEncode(config.consumerSecret)}&`;

  const parameters = Object.entries(oauth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${percentEncode(key)}=${value}`)
    .join('&');

  const signatureBaseString = [
    'POST',
    percentEncode(baseUrl),
    percentEncode(parameters),
  ].join('&');

  const signature = createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');

  const authHeader = `OAuth ${Object.entries(oauth)
    .map(([key, value]) => `${percentEncode(key)}="${value}"`)
    .join(', ')}, oauth_signature="${percentEncode(signature)}"`;

  console.log('Sending OAuth 1.0a request with params:', {
    url: baseUrl,
    method: 'POST',
    headers: { Authorization: authHeader }
  });

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
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