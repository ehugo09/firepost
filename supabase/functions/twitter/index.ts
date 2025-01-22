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
    const { content, mediaUrl } = await req.json();
    console.log("[Twitter] Processing request:", { content, mediaUrl });
    
    let params: any = { text: content };

    if (mediaUrl) {
      try {
        const mediaId = await uploadMediaToTwitter(mediaUrl);
        if (mediaId) {
          params.media = { media_ids: [mediaId] };
        }
      } catch (error) {
        console.error("[Twitter] Error uploading media:", error);
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

    if (!response.ok) {
      throw new Error(`Tweet failed: ${response.status}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
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