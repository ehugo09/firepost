import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getUserTwitterCredentials(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('social_connections')
    .select('access_token, twitter_credentials')
    .eq('user_id', userId)
    .eq('platform', 'twitter')
    .single();

  if (error) throw error;
  if (!data) throw new Error('No Twitter credentials found for user');

  return {
    accessToken: data.access_token,
    credentials: data.twitter_credentials
  };
}

function generateOAuthSignature(
  method: string,
  url: string,
  oauthParams: Record<string, string>,
  apiSecret: string,
  tokenSecret: string
): string {
  const signatureBaseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(
    Object.entries(oauthParams)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
  )}`;

  const signingKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(tokenSecret)}`;
  return createHmac("sha1", signingKey).update(signatureBaseString).digest("base64");
}

function generateOAuthHeader(
  method: string, 
  url: string, 
  credentials: any,
  accessToken: string
): string {
  const oauthParams = {
    oauth_consumer_key: credentials.api_key,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  const signature = generateOAuthSignature(
    method,
    url,
    oauthParams,
    credentials.api_secret,
    credentials.token_secret
  );

  return "OAuth " + Object.entries({
    ...oauthParams,
    oauth_signature: signature,
  })
    .sort()
    .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
    .join(", ");
}

async function postTweet(
  content: string, 
  mediaUrl: string | null = null,
  credentials: any,
  accessToken: string
) {
  console.log("[Twitter] Attempting to post tweet:", { content, mediaUrl });
  
  const tweetUrl = "https://api.twitter.com/2/tweets";
  let finalContent = content;

  if (mediaUrl) {
    finalContent = `${content} ${mediaUrl}`;
  }

  const params = { text: finalContent };

  try {
    // Petit délai pour éviter les problèmes de rate limit
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

    const response = await fetch(tweetUrl, {
      method: "POST",
      headers: {
        Authorization: generateOAuthHeader("POST", tweetUrl, credentials, accessToken),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const responseText = await response.text();
    console.log("[Twitter] API Response:", responseText);

    if (!response.ok) {
      if (response.status === 429) {
        console.error("[Twitter] Rate limit exceeded for user");
        throw new Error("Rate limit exceeded. Please try again in a few minutes.");
      }
      throw new Error(`Tweet failed: ${response.status} ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log("[Twitter] Tweet posted successfully:", data);
    return data;
  } catch (error) {
    console.error("[Twitter] Error posting tweet:", error);
    throw error;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Récupérer l'utilisateur à partir du token JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) throw new Error('Invalid user token');

    const { content, mediaUrl } = await req.json();
    console.log("[Twitter] Received request:", { content, mediaUrl, userId: user.id });

    if (!content) {
      throw new Error("Content is required");
    }

    // Récupérer les credentials Twitter de l'utilisateur
    const { accessToken, credentials } = await getUserTwitterCredentials(supabase, user.id);
    
    const result = await postTweet(content, mediaUrl, credentials, accessToken);

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
        status: error.message?.includes("Rate limit") ? 429 : 500
      }
    );
  }
});