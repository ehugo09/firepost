import { TwitterAuthResponse } from './types.ts';
import { generateNonce, generateTimestamp, createSignature } from './oauth-utils.ts';

const TWITTER_API_URL = 'https://api.twitter.com/oauth/request_token';
const TWITTER_ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';
const CALLBACK_URL = "https://app.firepost.co/auth/twitter/callback";

export async function getRequestToken(): Promise<TwitterAuthResponse> {
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

  const signature = createSignature(
    'POST',
    TWITTER_API_URL,
    oauthParams,
    consumerSecret
  );

  const authHeader = 'OAuth ' + Object.entries({
    ...oauthParams,
    oauth_signature: signature
  })
    .map(([key, value]) => `${encodeURIComponent(key)}="${encodeURIComponent(value)}"`)
    .join(', ');

  console.log('Authorization Header:', authHeader);

  const response = await fetch(TWITTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });

  const text = await response.text();
  console.log('Twitter API Response:', text);

  const params = new URLSearchParams(text);
  const oauth_token = params.get('oauth_token');

  if (!oauth_token) {
    throw new Error('No oauth_token in response');
  }

  console.log('Successfully obtained request token');
  return { oauth_token };
}

export async function getAccessToken(
  oauthToken: string,
  oauthVerifier: string
): Promise<TwitterAuthResponse> {
  const consumerKey = Deno.env.get("TWITTER_CONSUMER_KEY");
  const consumerSecret = Deno.env.get("TWITTER_CONSUMER_SECRET");

  if (!consumerKey || !consumerSecret) {
    console.error('Missing Twitter API credentials');
    throw new Error('Twitter API credentials not configured');
  }

  console.log('Starting access token exchange with:', { oauthToken, oauthVerifier });

  const oauthParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: generateNonce(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: generateTimestamp(),
    oauth_token: oauthToken,
    oauth_verifier: oauthVerifier,
    oauth_version: '1.0'
  };

  const signature = createSignature(
    'POST',
    TWITTER_ACCESS_TOKEN_URL,
    oauthParams,
    consumerSecret
  );

  const authHeader = 'OAuth ' + Object.entries({
    ...oauthParams,
    oauth_signature: signature
  })
    .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
    .join(', ');

  console.log('Authorization Header:', authHeader);

  const response = await fetch(TWITTER_ACCESS_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  const text = await response.text();
  console.log('Twitter Response:', text);

  const params = new URLSearchParams(text);
  return { oauth_token: params.get('oauth_token') };
}