import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";

const TWITTER_API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY") || "";
const TWITTER_API_SECRET_KEY = Deno.env.get("TWITTER_CONSUMER_SECRET") || "";
const CALLBACK_URL = "https://kyzayqvlqnunzzjtnnsm.supabase.co/auth/callback/twitter";

// Validate API keys on startup
console.log('Twitter OAuth Configuration:', {
  apiKeyLength: TWITTER_API_KEY.length,
  secretKeyLength: TWITTER_API_SECRET_KEY.length,
  callbackUrl: CALLBACK_URL
});

if (!TWITTER_API_KEY || !TWITTER_API_SECRET_KEY) {
  const error = 'Twitter API configuration is incomplete';
  console.error(error, {
    hasConsumerKey: !!TWITTER_API_KEY,
    hasConsumerSecret: !!TWITTER_API_SECRET_KEY
  });
  throw new Error(error);
}

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
    .replace(/\)/g, '%29')
    .replace(/\+/g, '%2B');
}

function createSignature(method: string, url: string, parameters: Record<string, string>, tokenSecret = "") {
  console.log('Creating OAuth signature with parameters:', {
    method,
    url,
    parameterCount: Object.keys(parameters).length,
    parameters: JSON.stringify(parameters),
    hasTokenSecret: !!tokenSecret
  });

  // Sort parameters alphabetically and encode values
  const sortedParams = Object.keys(parameters).sort().reduce((acc: Record<string, string>, key) => {
    acc[key] = percentEncode(parameters[key]);
    return acc;
  }, {});

  const paramString = Object.entries(sortedParams)
    .map(([key, value]) => `${percentEncode(key)}=${value}`)
    .join("&");

  const signatureBase = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(paramString)
  ].join("&");

  console.log('Generated signature components:', {
    paramString,
    signatureBase
  });
  
  const signingKey = `${percentEncode(TWITTER_API_SECRET_KEY)}&${percentEncode(tokenSecret)}`;
  const signature = hmac("sha1", signingKey, signatureBase, "utf8", "base64");
  
  console.log('Signature generated successfully:', {
    signatureLength: signature.length,
    signaturePrefix: signature.substring(0, 10) + '...'
  });

  return signature;
}

export async function createOAuthRequestToken() {
  console.log('Starting OAuth request token process');

  const url = "https://api.twitter.com/oauth/request_token";
  const method = "POST";
  const parameters = {
    oauth_callback: percentEncode(CALLBACK_URL),
    oauth_consumer_key: TWITTER_API_KEY,
    oauth_nonce: generateNonce(),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: generateTimestamp(),
    oauth_version: "1.0",
  };

  console.log('Generated OAuth parameters:', {
    callback: parameters.oauth_callback,
    consumerKey: parameters.oauth_consumer_key,
    nonce: parameters.oauth_nonce,
    timestamp: parameters.oauth_timestamp
  });

  const signature = createSignature(method, url, parameters);
  parameters["oauth_signature"] = signature;

  const authHeader = `OAuth ${Object.entries(parameters)
    .map(([key, value]) => `${key}="${percentEncode(value)}"`)
    .join(", ")}`;

  console.log('Prepared OAuth header length:', authHeader.length);

  try {
    console.log('Sending request to Twitter API');
    
    const response = await fetch(url, {
      method,
      headers: { 
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': '0'
      },
    });

    console.log('Twitter API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twitter API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Twitter API error: ${errorText}`);
    }

    const data = await response.text();
    console.log('Successfully received request token response');
    
    const parsed = Object.fromEntries(
      data.split("&").map((pair) => pair.split("="))
    );

    return parsed;
  } catch (error) {
    console.error('Error in OAuth request token process:', error);
    throw error;
  }
}

export async function createOAuthAccessToken(oauth_token: string, oauth_verifier: string) {
  console.log('Starting createOAuthAccessToken');
  console.log('Parameters:', { oauth_token, oauth_verifier });

  const url = "https://api.twitter.com/oauth/access_token";
  const method = "POST";
  const parameters = {
    oauth_consumer_key: TWITTER_API_KEY,
    oauth_nonce: generateNonce(),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: generateTimestamp(),
    oauth_token,
    oauth_verifier,
    oauth_version: "1.0",
  };

  const signature = createSignature(method, url, parameters);
  parameters["oauth_signature"] = signature;

  const authHeader = `OAuth ${Object.entries(parameters)
    .map(([key, value]) => `${key}="${percentEncode(value)}"`)
    .join(", ")}`;

  console.log('Authorization header:', authHeader);

  const response = await fetch(url, {
    method,
    headers: { Authorization: authHeader },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Twitter API error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error(`Failed to get access token: ${errorText}`);
  }

  const data = await response.text();
  console.log('Access token response:', data);
  
  return Object.fromEntries(data.split("&").map((pair) => pair.split("=")));
}

export async function verifyCredentials(oauth_token: string, oauth_token_secret: string) {
  console.log('Starting verifyCredentials');
  
  const url = "https://api.twitter.com/1.1/account/verify_credentials.json";
  const method = "GET";
  const parameters = {
    oauth_consumer_key: TWITTER_API_KEY,
    oauth_nonce: generateNonce(),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: generateTimestamp(),
    oauth_token,
    oauth_version: "1.0",
  };

  const signature = createSignature(method, url, parameters, oauth_token_secret);
  parameters["oauth_signature"] = signature;

  const authHeader = `OAuth ${Object.entries(parameters)
    .map(([key, value]) => `${key}="${percentEncode(value)}"`)
    .join(", ")}`;

  console.log('Authorization header:', authHeader);

  const response = await fetch(url, {
    headers: { Authorization: authHeader },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Twitter API error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error(`Failed to verify credentials: ${errorText}`);
  }

  return response.json();
}
