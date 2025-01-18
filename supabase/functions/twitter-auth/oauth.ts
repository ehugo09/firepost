import { TwitterAuthResponse } from './types.ts';
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const TWITTER_API_URL = 'https://api.twitter.com/oauth/request_token';
const CALLBACK_URL = "https://app.firepost.co/auth/twitter/callback";

function generateNonce(): string {
  return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}

function generateTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

function createSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret = ""
): string {
  // Sort parameters alphabetically
  const sortedParams = Object.keys(params).sort().reduce(
    (acc: Record<string, string>, key: string) => {
      acc[key] = params[key];
      return acc;
    },
    {}
  );

  // Create parameter string
  const paramString = Object.entries(sortedParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  // Create signature base string
  const signatureBaseString = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(paramString)
  ].join('&');

  console.log('Signature Base String:', signatureBaseString);

  // Create signing key
  const signingKey = `${encodeURIComponent(consumerSecret)}&${tokenSecret}`;
  
  // Generate signature
  const signature = createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');

  console.log('Generated Signature:', signature);
  
  return signature;
}

export async function getRequestToken(): Promise<TwitterAuthResponse> {
  console.log('Starting OAuth request token process');
  
  const consumerKey = Deno.env.get("TWITTER_CONSUMER_KEY");
  const consumerSecret = Deno.env.get("TWITTER_CONSUMER_SECRET");

  if (!consumerKey || !consumerSecret) {
    console.error('Missing Twitter API credentials');
    throw new Error('Twitter API credentials not configured');
  }

  console.log('Using callback URL:', CALLBACK_URL);

  const oauthParams: Record<string, string> = {
    oauth_callback: CALLBACK_URL,
    oauth_consumer_key: consumerKey,
    oauth_nonce: generateNonce(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: generateTimestamp(),
    oauth_version: '1.0'
  };

  // Generate signature
  const signature = createSignature(
    'POST',
    TWITTER_API_URL,
    oauthParams,
    consumerSecret
  );

  // Add signature to params
  oauthParams.oauth_signature = signature;

  // Create Authorization header
  const authHeader = 'OAuth ' + Object.entries(oauthParams)
    .map(([key, value]) => `${encodeURIComponent(key)}="${encodeURIComponent(value)}"`)
    .join(', ');

  console.log('Authorization Header:', authHeader);

  try {
    const response = await fetch(TWITTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twitter API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Twitter API error: ${response.status} - ${errorText}`);
    }

    const text = await response.text();
    console.log('Twitter API Response:', text);

    const params = new URLSearchParams(text);
    const oauth_token = params.get('oauth_token');
    const oauth_token_secret = params.get('oauth_token_secret');

    if (!oauth_token) {
      throw new Error('No oauth_token in response');
    }

    console.log('Successfully obtained request token');
    return { oauth_token };

  } catch (error) {
    console.error('Error in getRequestToken:', error);
    throw error;
  }
}