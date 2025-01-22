import { generateOAuthHeader } from "./oauth.ts";

export async function uploadMediaToTwitter(mediaUrl: string): Promise<string | null> {
  try {
    console.log("[Twitter Media] Fetching media from URL:", mediaUrl);
    
    const imageResponse = await fetch(mediaUrl);
    if (!imageResponse.ok) {
      console.error("[Twitter Media] Failed to fetch image:", await imageResponse.text());
      return null;
    }

    // Vérification de la taille avant de traiter l'image
    const contentLength = imageResponse.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 2 * 1024 * 1024) { // 2MB limit
      throw new Error("Image size exceeds 2MB limit");
    }

    const buffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(buffer)));

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
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    return data.media_id_string;
  } catch (error) {
    console.error("[Twitter Media] Error uploading media:", error);
    return null;
  }
}