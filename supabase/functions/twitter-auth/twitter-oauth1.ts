import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";

const TWITTER_API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY") || "";
const TWITTER_API_SECRET_KEY = Deno.env.get("TWITTER_CONSUMER_SECRET") || "";
const CALLBACK_URL = "https://preview--pandapost.lovable.app/auth/callback/twitter";

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

function createSignature(method: string, url: string, parameters: Record<string, string>, tokenSecret = "") {
  console.log('Creating signature with parameters:', parameters);
  
  const signatureBase = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(
      Object.keys(parameters)
        .sort()
        .map((key) => `${key}=${parameters[key]}`)
        .join("&")
    ),
  ].join("&");

  console.log('Signature base string:', signatureBase);

  const signingKey = `${percentEncode(TWITTER_API_SECRET_KEY)}&${percentEncode(tokenSecret)}`;
  const signature = hmac("sha1", signingKey, signatureBase, "utf8", "base64");
  
  console.log('Generated signature:', signature);
  return signature;
}

export async function createOAuthRequestToken() {
  console.log('Starting createOAuthRequestToken');
  console.log('Using API Key:', TWITTER_API_KEY);
  console.log('Callback URL:', CALLBACK_URL);

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
    throw new Error(`Failed to get request token: ${errorText}`);
  }

  const data = await response.text();
  console.log('Request token response:', data);
  
  const parsed = Object.fromEntries(
    data.split("&").map((pair) => pair.split("="))
  );

  return parsed;
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