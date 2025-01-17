import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";

const TWITTER_API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY") || "";
const TWITTER_API_SECRET_KEY = Deno.env.get("TWITTER_CONSUMER_SECRET") || "";
const CALLBACK_URL = "https://app.firepost.co/auth/twitter/callback";

// Validate API keys on startup
console.log('Twitter OAuth Configuration:', {
  apiKeyLength: TWITTER_API_KEY.length,
  secretKeyLength: TWITTER_API_SECRET_KEY.length,
  callbackUrl: CALLBACK_URL,
  hasConsumerKey: !!TWITTER_API_KEY,
  hasConsumerSecret: !!TWITTER_API_SECRET_KEY
});

if (!TWITTER_API_KEY || !TWITTER_API_SECRET_KEY) {
  throw new Error('Twitter API configuration is incomplete');
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
    .replace(/\)/g, '%29');
}

function createSignature(method: string, url: string, parameters: Record<string, string>, tokenSecret = "") {
  console.log('Creating OAuth signature with parameters:', {
    method,
    url,
    parameters: JSON.stringify(parameters)
  });

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
  
  console.log('Signature generated:', {
    signatureLength: signature.length,
    signaturePrefix: signature.substring(0, 10)
  });

  return signature;
}

export async function createOAuthRequestToken() {
  console.log('Starting OAuth request token process');

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

  console.log('Generated OAuth parameters:', parameters);

  const signature = createSignature(method, url, parameters);
  parameters["oauth_signature"] = signature;

  const authHeader = `OAuth ${Object.entries(parameters)
    .map(([key, value]) => `${key}="${percentEncode(value)}"`)
    .join(", ")}`;

  console.log('Sending request to Twitter API');
  
  try {
    const response = await fetch(url, {
      method,
      headers: { 
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
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