import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const generateState = () => crypto.randomUUID();

const generateCodeVerifier = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

const generateCodeChallenge = async (verifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const initiateTwitterAuth = async () => {
  try {
    console.log("Starting Twitter auth process");
    
    const { data, error } = await supabase.functions.invoke('twitter', {
      body: { action: 'connect' }
    });

    if (error) throw error;
    
    console.log("Received auth URL:", data);
    
    if (!data.url) throw new Error("No auth URL received");

    // Store PKCE values
    localStorage.setItem('twitter_oauth_state', data.state);
    localStorage.setItem('twitter_code_verifier', data.codeVerifier);
    
    // Open popup
    const width = 600;
    const height = 800;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const popup = window.open(
      data.url,
      'Twitter Auth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) throw new Error("Failed to open popup");

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        window.removeEventListener('message', messageHandler);
        localStorage.removeItem('twitter_oauth_state');
        localStorage.removeItem('twitter_code_verifier');
      };

      const messageHandler = async (event: MessageEvent) => {
        // Accept messages from preview and production URLs
        const validOrigins = [
          window.location.origin,
          'https://preview--pandapost.lovable.app',
          'https://pandapost.lovable.app'
        ];

        console.log("Received message from:", event.origin);
        console.log("Message data:", event.data);

        if (!validOrigins.includes(event.origin)) {
          console.log("Ignoring message from unauthorized origin");
          return;
        }

        if (event.data?.type === 'twitter_callback') {
          try {
            const { code, state } = event.data;
            
            if (!code || !state) throw new Error("Missing OAuth parameters");

            const storedState = localStorage.getItem('twitter_oauth_state');
            const codeVerifier = localStorage.getItem('twitter_code_verifier');

            if (!storedState || !codeVerifier) {
              throw new Error("Missing OAuth state or verifier");
            }

            if (state !== storedState) {
              throw new Error("Invalid state parameter");
            }

            const { data: tokens, error: tokenError } = await supabase.functions.invoke('twitter', {
              body: { 
                action: 'callback',
                code,
                codeVerifier
              }
            });

            if (tokenError) throw tokenError;

            popup.close();
            cleanup();
            resolve(tokens);
            toast.success("Successfully connected to Twitter!");
          } catch (error) {
            console.error("Error in callback:", error);
            popup.close();
            cleanup();
            reject(error);
            toast.error("Failed to connect to Twitter");
          }
        }

        if (event.data?.type === 'twitter_callback_error') {
          console.error("Received error from callback:", event.data.error);
          popup.close();
          cleanup();
          reject(new Error(event.data.error));
          toast.error("Failed to connect to Twitter");
        }
      };

      window.addEventListener('message', messageHandler);

      // Check if popup is closed
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          cleanup();
          reject(new Error("Authentication cancelled"));
        }
      }, 1000);
    });
  } catch (error) {
    console.error("Twitter auth error:", error);
    toast.error("Failed to connect to Twitter");
    throw error;
  }
};