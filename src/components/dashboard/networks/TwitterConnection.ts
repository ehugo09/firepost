import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const generateState = () => crypto.randomUUID();

const generateCodeVerifier = (length: number = 64): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(x => charset[x % charset.length])
    .join('');
};

const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const base64Url = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return base64Url;
};

export const handleTwitterCallback = async (code: string, state: string) => {
  try {
    console.log("Starting Twitter callback handling with code:", code);
    
    const storedState = localStorage.getItem('twitter_oauth_state');
    console.log("Comparing states:", { stored: storedState, received: state });
    
    if (state !== storedState) {
      console.error("State mismatch:", { stored: storedState, received: state });
      throw new Error('Invalid state parameter');
    }

    const codeVerifier = localStorage.getItem('twitter_code_verifier');
    if (!codeVerifier) {
      throw new Error('No code verifier found');
    }

    console.log("Exchanging code for token...");
    const { data: callbackData, error: callbackError } = await supabase.functions.invoke('twitter', {
      body: { 
        action: 'callback',
        code,
        codeVerifier
      }
    });

    if (callbackError) {
      console.error("Callback error:", callbackError);
      throw callbackError;
    }

    console.log("Received callback data:", callbackData);

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
        twitter_credentials: callbackData.tokens,
        refresh_token: callbackData.tokens.refresh_token,
        token_expires_at: new Date(Date.now() + (callbackData.tokens.expires_in * 1000)).toISOString()
      });

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw insertError;
    }

    localStorage.removeItem('twitter_oauth_state');
    localStorage.removeItem('twitter_code_verifier');

    console.log("Twitter connection successful");
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

      localStorage.setItem('twitter_oauth_state', data.state);
      localStorage.setItem('twitter_code_verifier', data.codeVerifier);
      console.log("Stored state and verifier in localStorage");

      if (popup) {
        console.log("Popup opened successfully");
        
        return new Promise((resolve, reject) => {
          const messageHandler = async (event: MessageEvent) => {
            try {
              // Get all possible valid origins
              const validOrigins = [
                window.location.origin,
                'https://preview--pandapost.lovable.app',
                'https://pandapost.lovable.app'
              ];
              
              console.log("Received message from origin:", event.origin);
              console.log("Valid origins:", validOrigins);
              console.log("Message data:", event.data);
              
              if (!validOrigins.includes(event.origin)) {
                console.log("Ignoring message from unauthorized origin:", event.origin);
                return;
              }
              
              if (event.data?.type === 'twitter_callback') {
                window.removeEventListener('message', messageHandler);
                const { code, state } = event.data;
                
                if (code && state) {
                  const result = await handleTwitterCallback(code, state);
                  popup.close();
                  resolve(result);
                }
              }

              if (event.data?.type === 'twitter_callback_error') {
                window.removeEventListener('message', messageHandler);
                popup.close();
                reject(new Error(event.data.error));
              }
            } catch (error) {
              console.error("Error handling popup message:", error);
              window.removeEventListener('message', messageHandler);
              popup.close();
              reject(error);
            }
          };

          window.addEventListener('message', messageHandler);

          // Check if popup is closed
          const checkClosed = setInterval(() => {
            if (popup.closed) {
              console.log("Popup was closed");
              clearInterval(checkClosed);
              window.removeEventListener('message', messageHandler);
              localStorage.removeItem('twitter_oauth_state');
              localStorage.removeItem('twitter_code_verifier');
              reject(new Error("Authentication cancelled"));
            }
          }, 1000);
        });
      } else {
        console.error("Failed to open popup window");
        throw new Error("Failed to open authentication window");
      }
    } else {
      console.error("No URL received from Twitter function");
      throw new Error("Failed to get authentication URL");
    }
  } catch (error) {
    console.error("Connection error:", error);
    throw error;
  }
};