import { TwitterAuthResponse, CALLBACK_URL } from './types.ts';
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";

function generateNonce(): string {
  return crypto.randomUUID();
}

function generateTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/\*/g, '%2A')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

function createSignature(method: string, url: string, params: Record<string, string>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc: Record<string, string>, key) => {
      acc[key] = params[key];
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

  const signingKey = `${percentEncode(Deno.env.get("TWITTER_CONSUMER_SECRET") || "")}&`;
  return hmac("sha1", signingKey, signatureBaseString, "utf8", "base64");
}

export async function handleOAuth1Request(): Promise<TwitterAuthResponse> {
  console.log('Starting OAuth 1.0a request token process');

  const url = "https://api.twitter.com/oauth/request_token";
  const method = "POST";
  const params = {
    oauth_callback: CALLBACK_URL,
    oauth_consumer_key: Deno.env.get("TWITTER_CONSUMER_KEY") || '',
    oauth_nonce: generateNonce(),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: generateTimestamp(),
    oauth_version: "1.0"
  };

  const signature = createSignature(method, url, params);
  params["oauth_signature"] = signature;

  const authHeader = `OAuth ${Object.entries(params)
    .map(([key, value]) => `${key}="${percentEncode(value)}"`)
    .join(", ")}`;

  try {
    const response = await fetch(url, {
      method,
      headers: { 
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twitter OAuth 1.0a error:', {
        status: response.status,
        body: errorText
      });
      throw new Error(`Twitter OAuth 1.0a error: ${errorText}`);
    }

    const data = await response.text();
    const parsed = Object.fromEntries(
      data.split("&").map((pair) => pair.split("="))
    );

    return parsed;
  } catch (error) {
    console.error('OAuth 1.0a request failed:', error);
    throw error;
  }
}