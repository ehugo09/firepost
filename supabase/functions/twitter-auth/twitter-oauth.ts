import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";

const TWITTER_API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY") || "";
const TWITTER_API_SECRET_KEY = Deno.env.get("TWITTER_CONSUMER_SECRET") || "";
const CALLBACK_URL = "https://app.firepost.co/auth/twitter/callback";

// Validate configuration on startup
console.log('Twitter OAuth Configuration:', {
  apiKeyLength: TWITTER_API_KEY.length,
  secretKeyLength: TWITTER_API_SECRET_KEY.length,
  callbackUrl: CALLBACK_URL
});

function generateNonce() {
  return Math.random().toString(36).substring(2);
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

function createSignature(method: string, url: string, parameters: Record<string, string>) {
  console.log('Creating signature with parameters:', parameters);
  
  const sortedParams = Object.keys(parameters)
    .sort()
    .reduce((acc: Record<string, string>, key) => {
      acc[key] = parameters[key];
      return acc;
    }, {});

  const paramString = Object.entries(sortedParams)
    .map(([key, value]) => `${percentEncode(key)}=${percentEncode(value)}`)
    .join("&");

  const signatureBaseString = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(paramString)
  ].join("&");

  console.log('Signature base string:', signatureBaseString);
  
  const signingKey = `${percentEncode(TWITTER_API_SECRET_KEY)}&`;
  const signature = hmac("sha1", signingKey, signatureBaseString, "utf8", "base64");
  
  console.log('Generated signature:', signature);
  return signature;
}

export async function createOAuthRequestToken() {
  console.log('Starting OAuth request token process');

  const url = "https://api.twitter.com/oauth/request_token";
  const method = "POST";
  const timestamp = generateTimestamp();
  const nonce = generateNonce();

  const parameters = {
    oauth_callback: CALLBACK_URL,
    oauth_consumer_key: TWITTER_API_KEY,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_version: "1.0"
  };

  const signature = createSignature(method, url, parameters);
  parameters["oauth_signature"] = signature;

  const authHeader = `OAuth ${Object.entries(parameters)
    .map(([key, value]) => `${key}="${percentEncode(value)}"`)
    .join(", ")}`;

  console.log('Authorization header:', authHeader);

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    console.log('Twitter API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (!response.ok) {
      throw new Error(`Twitter API error: ${responseText}`);
    }

    const data = Object.fromEntries(
      responseText.split("&").map((pair) => pair.split("="))
    );

    console.log('Successfully received request token:', data);
    return data;
  } catch (error) {
    console.error('Error in OAuth request token process:', error);
    throw error;
  }
}

// OAuth 2.0 implementation
export async function createOAuth2RequestToken() {
  console.log('Starting OAuth 2.0 request token process');
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: TWITTER_API_KEY,
    redirect_uri: CALLBACK_URL,
    scope: 'tweet.read tweet.write users.read follows.read follows.write',
    state: 'state',
    code_challenge: 'challenge',
    code_challenge_method: 'plain'
  });

  const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  
  return {
    oauth_token: params.get('state'),
    auth_url: authUrl
  };
}