import { createHmac } from "node:crypto";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation des variables d'environnement
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
  oauthParams: Record<string, string>,
): string {
  const signatureBaseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(
    Object.entries(oauthParams)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
  )}`;

  const signingKey = `${encodeURIComponent(API_SECRET)}&${encodeURIComponent(ACCESS_TOKEN_SECRET)}`;
  return createHmac("sha1", signingKey).update(signatureBaseString).digest("base64");
}

function generateOAuthHeader(method: string, url: string): string {
  const oauthParams = {
    oauth_consumer_key: API_KEY,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: ACCESS_TOKEN,
    oauth_version: "1.0",
  };

  const signature = generateOAuthSignature(method, url, oauthParams);

  return "OAuth " + Object.entries({
    ...oauthParams,
    oauth_signature: signature,
  })
    .sort()
    .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
    .join(", ");
}

async function postTweet(content: string, mediaUrl: string | null = null) {
  console.log("[Twitter] Posting tweet:", { content, mediaUrl });
  
  const tweetUrl = "https://api.twitter.com/2/tweets";
  const params: any = { text: content };

  // Si on a une URL de média, on l'ajoute simplement comme texte pour l'instant
  // pour éviter les problèmes de mémoire avec l'upload
  if (mediaUrl) {
    params.text += ` ${mediaUrl}`;
  }

  try {
    const response = await fetch(tweetUrl, {
      method: "POST",
      headers: {
        Authorization: generateOAuthHeader("POST", tweetUrl),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Twitter] Error response:", errorText);
      throw new Error(`Tweet failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("[Twitter] Tweet posted successfully:", data);
    return data;
  } catch (error) {
    console.error("[Twitter] Error posting tweet:", error);
    throw error;
  }
}

Deno.serve(async (req) => {
  // Gestion des CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, mediaUrl } = await req.json();
    console.log("[Twitter] Received request:", { content, mediaUrl });

    if (!content) {
      throw new Error("Content is required");
    }

    const result = await postTweet(content, mediaUrl);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("[Twitter] Error in edge function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unexpected error occurred",
        details: error.toString()
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 500
      }
    );
  }
});