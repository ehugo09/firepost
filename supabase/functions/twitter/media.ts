export async function uploadMediaToTwitter(mediaUrl: string): Promise<string | null> {
  try {
    console.log("[Twitter] Fetching media from URL:", mediaUrl);
    
    // Fetch the image from Supabase storage
    const imageResponse = await fetch(mediaUrl);
    if (!imageResponse.ok) {
      console.error("[Twitter] Failed to fetch image:", await imageResponse.text());
      return null;
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
    
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
      console.error("[Twitter] Media upload failed:", await response.text());
      return null;
    }

    const data = await response.json();
    console.log("[Twitter] Media upload successful, ID:", data.media_id_string);
    return data.media_id_string;
  } catch (error) {
    console.error("[Twitter] Error uploading media:", error);
    return null;
  }
}