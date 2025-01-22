import { generateOAuthHeader } from "./oauth.ts";

export async function uploadMediaToTwitter(mediaUrl: string): Promise<string | null> {
  try {
    console.log("[Twitter Media] Fetching media from URL:", mediaUrl);
    
    const imageResponse = await fetch(mediaUrl);
    if (!imageResponse.ok) {
      console.error("[Twitter Media] Failed to fetch image:", await imageResponse.text());
      return null;
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
    
    console.log("[Twitter Media] Image converted to base64, uploading to Twitter");
    
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Twitter Media] Media upload failed:", errorText);
      return null;
    }

    const data = await response.json();
    console.log("[Twitter Media] Upload successful, media ID:", data.media_id_string);
    return data.media_id_string;
  } catch (error) {
    console.error("[Twitter Media] Error uploading media:", error);
    return null;
  }
}