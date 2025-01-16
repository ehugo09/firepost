import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const handleTwitterCallback = async (code: string, state: string) => {
  try {
    console.log("Starting Twitter callback handling with code:", code);
    
    // Verify state matches
    const storedState = localStorage.getItem('twitter_oauth_state');
    console.log("Comparing states:", { stored: storedState, received: state });
    
    if (state !== storedState) {
      console.error("State mismatch:", { stored: storedState, received: state });
      throw new Error('Invalid state parameter');
    }

    // Exchange code for token
    console.log("Exchanging code for token...");
    const { data: callbackData, error: callbackError } = await supabase.functions.invoke('twitter', {
      body: { 
        action: 'callback',
        code,
        codeVerifier: localStorage.getItem('twitter_code_verifier')
      }
    });

    if (callbackError) {
      console.error("Callback error:", callbackError);
      throw callbackError;
    }

    console.log("Received callback data:", callbackData);

    // Save connection to database
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error("No active session found");
      throw new Error('No active session');
    }

    console.log("Saving connection to database...");
    const { error: insertError } = await supabase
      .from('social_connections')
      .upsert({
        user_id: session.user.id,
        platform: 'twitter',
        username: callbackData.user.username,
        platform_user_id: callbackData.user.id,
        twitter_credentials: callbackData.tokens
      });

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw insertError;
    }

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
    console.log("Starting Twitter connection process...");
    
    const { data, error } = await supabase.functions.invoke('twitter', {
      body: { action: 'connect' }
    });

    if (error) {
      console.error("Connection error:", error);
      throw error;
    }
    
    console.log("Received auth data:", data);
    
    if (data.url) {
      const width = 600;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      console.log("Opening popup with URL:", data.url);
      const popup = window.open(
        data.url,
        'Twitter Auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Store state and verifier
      localStorage.setItem('twitter_oauth_state', data.state);
      localStorage.setItem('twitter_code_verifier', data.codeVerifier);
      console.log("Stored state and verifier in localStorage");

      if (popup) {
        console.log("Popup opened successfully");
        
        // Create a message event listener for the popup
        window.addEventListener('message', async function messageHandler(event) {
          try {
            // Check if the message is from our popup
            if (event.data && event.data.type === 'twitter_callback') {
              console.log("Received callback message from popup:", event.data);
              const { code, state } = event.data;
              
              if (code && state) {
                window.removeEventListener('message', messageHandler);
                await handleTwitterCallback(code, state);
                popup.close();
                window.location.reload();
              }
            }
          } catch (error) {
            console.error("Error handling popup message:", error);
          }
        });

        // Check if popup is closed
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            console.log("Popup was closed");
            clearInterval(checkClosed);
            localStorage.removeItem('twitter_oauth_state');
            localStorage.removeItem('twitter_code_verifier');
          }
        }, 1000);

      } else {
        console.error("Failed to open popup window");
        toast.error("Failed to open authentication window");
      }
    }
  } catch (error) {
    console.error("Connection error:", error);
    toast.error("Failed to connect to Twitter");
  }
};