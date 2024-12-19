import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const handleTwitterCallback = async (code: string, state: string) => {
  try {
    // Verify state matches
    const storedState = localStorage.getItem('twitter_oauth_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    // Exchange code for token
    const { data: callbackData, error: callbackError } = await supabase.functions.invoke('twitter', {
      body: { 
        action: 'callback',
        code,
        codeVerifier: localStorage.getItem('twitter_code_verifier')
      }
    });

    if (callbackError) throw callbackError;

    // Save connection to database
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('No active session');

    const { error: insertError } = await supabase
      .from('social_connections')
      .upsert({
        user_id: session.user.id,
        platform: 'twitter',
        username: callbackData.user.username,
        platform_user_id: callbackData.user.id,
        twitter_credentials: callbackData
      });

    if (insertError) throw insertError;

    // Clean up
    localStorage.removeItem('twitter_oauth_state');
    localStorage.removeItem('twitter_code_verifier');

    console.log("Twitter connection successful:", callbackData);
    toast.success("Successfully connected to Twitter!");

    return callbackData;
  } catch (error) {
    console.error("Twitter callback error:", error);
    toast.error("Failed to connect to Twitter");
    throw error;
  }
};

export const openTwitterPopup = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('twitter', {
      body: { action: 'connect' }
    });

    if (error) throw error;
    
    if (data.url) {
      const width = 600;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        data.url,
        'Twitter Auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Store state and verifier
      localStorage.setItem('twitter_oauth_state', data.state);
      localStorage.setItem('twitter_code_verifier', data.codeVerifier);

      if (popup) {
        const checkPopup = setInterval(async () => {
          try {
            if (popup.closed) {
              clearInterval(checkPopup);
              localStorage.removeItem('twitter_oauth_state');
              localStorage.removeItem('twitter_code_verifier');
              return;
            }

            // Check if the popup URL contains the code parameter
            if (popup.location.href.includes('code=')) {
              const url = new URL(popup.location.href);
              const code = url.searchParams.get('code');
              const state = url.searchParams.get('state');
              
              await handleTwitterCallback(code!, state!);
              
              popup.close();
              clearInterval(checkPopup);
            }
          } catch (error: any) {
            // Ignore errors from cross-origin frames
            if (!error.message.includes('cross-origin')) {
              console.error("Error in popup check:", error);
              clearInterval(checkPopup);
            }
          }
        }, 1000);
      }
    }
  } catch (error) {
    console.error("Connection error:", error);
    toast.error("Failed to connect to Twitter");
  }
};