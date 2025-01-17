import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";

const TWITTER_API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY") || "";
const TWITTER_API_SECRET_KEY = Deno.env.get("TWITTER_CONSUMER_SECRET") || "";
const TWITTER_CLIENT_ID = Deno.env.get("TWITTER_CLIENT_ID") || "";
const TWITTER_CLIENT_SECRET = Deno.env.get("TWITTER_CLIENT_SECRET") || "";
const CALLBACK_URL = "https://app.firepost.co/auth/callback/twitter";

// OAuth 2.0
export async function createOAuth2RequestToken() {
  console.log('Starting OAuth 2.0 request token process');
  
  const credentials = btoa(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`);
  const url = "https://api.twitter.com/2/oauth2/token";
  
  const params = new URLSearchParams({
    'code_challenge_method': 'plain',
    'code_challenge': 'challenge',
    'response_type': 'code',
    'client_id': TWITTER_CLIENT_ID,
    'redirect_uri': CALLBACK_URL,
    'scope': 'tweet.read tweet.write users.read follows.read follows.write',
    'state': 'state'
  });

  const response = await fetch(`https://twitter.com/i/oauth2/authorize?${params.toString()}`, {
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  if (!response.ok) {
    throw new Error(`OAuth 2.0 error: ${await response.text()}`);
  }

  return await response.json();
}

// OAuth 1.0a
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
  
  const signingKey = `${percentEncode(TWITTER_API_SECRET_KEY)}&${percentEncode(tokenSecret)}`;
  return hmac("sha1", signingKey, signatureBase, "utf8", "base64");
}

export async function createOAuthRequestToken() {
  console.log('Starting OAuth 1.0a request token process');

  const url = "https://api.twitter.com/oauth/request_token";
  const method = "POST";
  const parameters = {
    oauth_callback: CALLBACK_URL,
    oauth_consumer_key: TWITTER_API_KEY,
    oauth_nonce: generateNonce(),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: generateTimestamp(),
    oauth_version: "1.0"
  };

  const signature = createSignature(method, url, parameters);
  parameters["oauth_signature"] = signature;

  const authHeader = `OAuth ${Object.entries(parameters)
    .map(([key, value]) => `${key}="${percentEncode(value)}"`)
    .join(", ")}`;

  const response = await fetch(url, {
    method,
    headers: { 
      Authorization: authHeader,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  if (!response.ok) {
    throw new Error(`OAuth 1.0a error: ${await response.text()}`);
  }

  const data = await response.text();
  return Object.fromEntries(data.split("&").map((pair) => pair.split("=")));
}