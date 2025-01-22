import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { generateOAuthHeader } from "./oauth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getUserTwitterCredentials(supabase: any, userId: string) {
  console.log("[Twitter] Getting credentials for user:", userId);
  
  const { data, error } = await supabase
    .from('social_connections')
    .select('access_token, twitter_credentials')
    .eq('user_id', userId)
    .eq('platform', 'twitter')
    .single();

  if (error) {
    console.error("[Twitter] Error fetching credentials:", error);
    throw error;
  }
  if (!data) {
    console.error("[Twitter] No Twitter credentials found for user");
    throw new Error('No Twitter credentials found for user');
  }

  console.log("[Twitter] Successfully retrieved credentials");
  return {
    accessToken: data.access_token,
    credentials: data.twitter_credentials
  };
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
    // Add a random delay between 1-3 seconds to help with rate limiting
    const delay = Math.floor(Math.random() * 2000) + 1000;
    console.log(`[Twitter] Adding delay of ${delay}ms before posting`);
    await new Promise(resolve => setTimeout(resolve, delay));

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

    // Get user from JWT token
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) throw new Error('Invalid user token');

    const { content, mediaUrl } = await req.json();
    console.log("[Twitter] Received request:", { content, mediaUrl, userId: user.id });

    if (!content) {
      throw new Error("Content is required");
    }

    // Get user's Twitter credentials
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