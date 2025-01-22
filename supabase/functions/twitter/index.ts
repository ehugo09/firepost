import { createHmac } from "node:crypto";

const API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY")?.trim();
const API_SECRET = Deno.env.get("TWITTER_CONSUMER_SECRET")?.trim();
const ACCESS_TOKEN = Deno.env.get("TWITTER_ACCESS_TOKEN")?.trim();
const ACCESS_TOKEN_SECRET = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET")?.trim();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function validateEnvironmentVariables() {
  if (!API_KEY) {
    throw new Error("Missing TWITTER_CONSUMER_KEY environment variable");
  }
  if (!API_SECRET) {
    throw new Error("Missing TWITTER_CONSUMER_SECRET environment variable");
  }
  if (!ACCESS_TOKEN) {
    throw new Error("Missing TWITTER_ACCESS_TOKEN environment variable");
  }
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error("Missing TWITTER_ACCESS_TOKEN_SECRET environment variable");
  }
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
  const signingKey = `${encodeURIComponent(
    consumerSecret
  )}&${encodeURIComponent(tokenSecret)}`;
  const hmacSha1 = createHmac("sha1", signingKey);
  const signature = hmacSha1.update(signatureBaseString).digest("base64");

  console.log("[Twitter Edge] Generated OAuth signature");
  return signature;
}

function generateOAuthHeader(method: string, url: string): string {
  const oauthParams = {
    oauth_consumer_key: API_KEY!,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: ACCESS_TOKEN!,
    oauth_version: "1.0",
  };

  const signature = generateOAuthSignature(
    method,
    url,
    oauthParams,
    API_SECRET!,
    ACCESS_TOKEN_SECRET!
  );

  const signedOAuthParams = {
    ...oauthParams,
    oauth_signature: signature,
  };

  return (
    "OAuth " +
    Object.entries(signedOAuthParams)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
      .join(", ")
  );
}

async function uploadMedia(mediaUrl: string): Promise<string | null> {
  try {
    console.log("[Twitter Edge] Starting media upload for URL:", mediaUrl);
    
    // Fetch the image from Supabase storage
    const imageResponse = await fetch(mediaUrl);
    if (!imageResponse.ok) {
      console.error("[Twitter Edge] Failed to fetch image:", await imageResponse.text());
      return null;
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
    
    // Upload to Twitter
    const uploadUrl = "https://upload.twitter.com/1.1/media/upload.json";
    const method = "POST";
    const oauthHeader = generateOAuthHeader(method, uploadUrl);

    const formData = new FormData();
    formData.append("media_data", base64Image);

    console.log("[Twitter Edge] Sending media upload request to Twitter...");
    
    const uploadResponse = await fetch(uploadUrl, {
      method: method,
      headers: {
        Authorization: oauthHeader,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const responseText = await uploadResponse.text();
      console.error("[Twitter Edge] Twitter upload failed:", responseText);
      throw new Error(`Upload failed: ${responseText}`);
    }

    const uploadData = await uploadResponse.json();
    console.log("[Twitter Edge] Media upload successful, ID:", uploadData.media_id_string);
    
    return uploadData.media_id_string;
  } catch (error) {
    console.error("[Twitter Edge] Error in uploadMedia:", error);
    return null;
  }
}

async function sendTweet(content: string, mediaUrl?: string): Promise<any> {
  console.log("[Twitter Edge] Preparing to send tweet with content:", content);
  console.log("[Twitter Edge] Media URL provided:", mediaUrl);

  const url = "https://api.twitter.com/2/tweets";
  const method = "POST";
  let params: any = { text: content };

  if (mediaUrl) {
    console.log("[Twitter Edge] Media URL provided, attempting upload");
    const mediaId = await uploadMedia(mediaUrl);
    if (mediaId) {
      console.log("[Twitter Edge] Media uploaded successfully, adding to tweet params");
      params = {
        ...params,
        media: { media_ids: [mediaId] }
      };
    } else {
      console.warn("[Twitter Edge] Media upload failed, proceeding with text-only tweet");
    }
  }

  console.log("[Twitter Edge] Final tweet params:", params);

  const oauthHeader = generateOAuthHeader(method, url);
  const response = await fetch(url, {
    method: method,
    headers: {
      Authorization: oauthHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const responseText = await response.text();
  console.log("[Twitter Edge] Tweet response:", responseText);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
  }

  return JSON.parse(responseText);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    validateEnvironmentVariables();
    const { content, mediaUrl } = await req.json();
    
    if (!content) {
      throw new Error("Tweet content is required");
    }

    console.log("[Twitter Edge] Attempting to send tweet with content:", content);
    console.log("[Twitter Edge] Media URL:", mediaUrl);
    
    const tweet = await sendTweet(content, mediaUrl);
    
    return new Response(JSON.stringify(tweet), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("[Twitter Edge] An error occurred:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});