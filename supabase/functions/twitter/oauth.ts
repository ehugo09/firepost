import { createHmac } from "node:crypto";

const API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY")?.trim();
const API_SECRET = Deno.env.get("TWITTER_CONSUMER_SECRET")?.trim();
const ACCESS_TOKEN = Deno.env.get("TWITTER_ACCESS_TOKEN")?.trim();
const ACCESS_TOKEN_SECRET = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET")?.trim();

if (!API_KEY || !API_SECRET || !ACCESS_TOKEN || !ACCESS_TOKEN_SECRET) {
  throw new Error("Missing required Twitter API credentials");
}

function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const signatureBaseString = `${method}&${encodeURIComponent(
    url
  )}&${encodeURIComponent(
    Object.entries(params)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
  )}`;

  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(
    tokenSecret
  )}`;

  return createHmac("sha1", signingKey)
    .update(signatureBaseString)
    .digest("base64");
}

export function generateOAuthHeader(method: string, url: string): string {
  const oauthParams = {
    oauth_consumer_key: API_KEY,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: ACCESS_TOKEN,
    oauth_version: "1.0",
  };

  const signature = generateOAuthSignature(
    method,
    url,
    oauthParams,
    API_SECRET,
    ACCESS_TOKEN_SECRET
  );

  return (
    "OAuth " +
    Object.entries({ ...oauthParams, oauth_signature: signature })
      .sort()
      .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
      .join(", ")
  );
}