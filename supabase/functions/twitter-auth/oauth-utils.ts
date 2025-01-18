import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

export function generateNonce(): string {
  return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}

export function generateTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

export function createSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret = ""
): string {
  const sortedParams = Object.keys(params).sort().reduce(
    (acc: Record<string, string>, key: string) => {
      acc[key] = params[key];
      return acc;
    },
    {}
  );

  const paramString = Object.entries(sortedParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  const signatureBaseString = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(paramString)
  ].join('&');

  console.log('Signature Base String:', signatureBaseString);

  const signingKey = `${encodeURIComponent(consumerSecret)}&${tokenSecret}`;
  
  const signature = createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');

  console.log('Generated Signature:', signature);
  
  return signature;
}