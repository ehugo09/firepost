import { generateOAuthHeader } from "./oauth.ts";

export async function uploadMediaToTwitter(mediaUrl: string): Promise<string | null> {
  try {
    console.log("[Twitter Media] Fetching media from URL:", mediaUrl);
    
    const imageResponse = await fetch(mediaUrl);
    if (!imageResponse.ok) {
      console.error("[Twitter Media] Failed to fetch image:", await imageResponse.text());
      return null;
    }
    
    // Limiter la taille du buffer pour éviter les problèmes de mémoire
    const contentLength = imageResponse.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 5 * 1024 * 1024) { // 5MB limit
      throw new Error("Image size exceeds 5MB limit");
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
    
    console.log("[Twitter Media] Image converted to base64, uploading to Twitter");
    
    // Ajouter un délai pour respecter les limites de taux
    await new Promise(resolve => setTimeout(resolve, 1000));

    const uploadUrl = "https://upload.twitter.com/1.1/media/upload.json";
    const formData = new FormData();
    formData.append("media_data", base64Image);

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: generateOAuthHeader("POST", uploadUrl),
      },
      body: formData,
    });

    const responseText = await response.text();
    console.log("[Twitter Media] Upload response:", responseText);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Twitter rate limit exceeded for media upload");
      }
      throw new Error(`Upload failed: ${response.status} ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log("[Twitter Media] Upload successful, media ID:", data.media_id_string);
    return data.media_id_string;
  } catch (error) {
    console.error("[Twitter Media] Error uploading media:", error);
    throw error;
  }
}