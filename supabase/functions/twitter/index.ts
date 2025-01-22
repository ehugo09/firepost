import { generateOAuthHeader } from "./oauth.ts";
import { uploadMediaToTwitter } from "./media.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[Twitter] Received request");
    const { content, mediaUrl } = await req.json();
    
    if (!content) {
      throw new Error("Tweet content is required");
    }

    console.log("[Twitter] Processing request:", { content, mediaUrl });
    
    let params: any = { text: content };

    if (mediaUrl) {
      try {
        console.log("[Twitter] Media URL detected, uploading to Twitter");
        const mediaId = await uploadMediaToTwitter(mediaUrl);
        if (mediaId) {
          console.log("[Twitter] Adding media to tweet params, ID:", mediaId);
          params.media = { media_ids: [mediaId] };
        }
      } catch (error) {
        console.error("[Twitter] Error uploading media:", error);
        throw new Error(`Failed to upload media: ${error.message}`);
      }
    }

    const url = "https://api.twitter.com/2/tweets";
    console.log("[Twitter] Sending tweet with params:", params);

    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: generateOAuthHeader("POST", url),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const responseText = await response.text();
    console.log("[Twitter] Tweet response:", responseText);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Twitter rate limit exceeded. Please wait a few minutes and try again.");
      }
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
    }

    return new Response(responseText, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Twitter] Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : undefined
      }), 
      { 
        status: error.message.includes("rate limit") ? 429 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});