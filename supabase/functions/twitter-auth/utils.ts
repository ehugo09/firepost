import { OAuthSignatureParams } from './types.ts';
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

// Génère un nonce aléatoire
export function generateNonce(length = 32): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(
    { length }, 
    () => charset.charAt(Math.floor(Math.random() * charset.length))
  ).join('');
}

// Génère un timestamp OAuth
export function generateTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

// Encode selon RFC3986
export function rfc3986Encode(str: string): string {
  return encodeURIComponent(str)
    .replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
    .replace(/[^A-Za-z0-9\-._~]/g, c => 
      `%${c.charCodeAt(0).toString(16).toUpperCase()}`
    );
}

// Crée la signature OAuth
export function createSignature(
  method: string,
  url: string,
  params: OAuthSignatureParams,
  consumerSecret: string,
  tokenSecret = ""
): string {
  // 1. Créer la base string
  const sortedParams = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${rfc3986Encode(key)}=${rfc3986Encode(value)}`)
    .join('&');

  const signatureBaseString = [
    method.toUpperCase(),
    rfc3986Encode(url),
    rfc3986Encode(sortedParams)
  ].join('&');

  // 2. Créer la clé de signature
  const signingKey = `${rfc3986Encode(consumerSecret)}&${rfc3986Encode(tokenSecret)}`;

  // 3. Calculer la signature
  return createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');
}

// Crée l'en-tête d'autorisation OAuth
export function createAuthorizationHeader(
  params: OAuthSignatureParams,
  signature: string
): string {
  const oauthParams = {
    ...params,
    oauth_signature: signature
  };

  return 'OAuth ' + Object.entries(oauthParams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${rfc3986Encode(key)}="${rfc3986Encode(value)}"`)
    .join(', ');
}