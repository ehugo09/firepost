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
      console.log("[Twitter] Media URL detected, uploading to Twitter");
      const mediaId = await uploadMediaToTwitter(mediaUrl);
      if (mediaId) {
        console.log("[Twitter] Adding media to tweet params, ID:", mediaId);
        params.media = { media_ids: [mediaId] };
      }
    }

    const url = "https://api.twitter.com/2/tweets";
    console.log("[Twitter] Sending tweet with params:", params);

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
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
    }

    return new Response(responseText, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Twitter] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});