import { supabase } from "@/integrations/supabase/client";
import { generateCodeVerifier, generateCodeChallenge, generateState } from "./oauth/utils";
import type { OAuthState } from "./oauth/types";
import { toast } from "sonner";

const TWITTER_AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const TWITTER_CLIENT_ID = 'akNKemhMMnZBdlJTYzliRjRtd1o6MTpjaQ';
const REDIRECT_URI = 'https://preview--pandapost.lovable.app/auth/callback/twitter';

export class TwitterService {
  static async connect(): Promise<void> {
    console.log("Starting Twitter connection process...");
    try {
      const state = generateState();
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Store PKCE values in localStorage
      const oauthState: OAuthState = { codeVerifier, state };
      localStorage.setItem('twitter_oauth_state', JSON.stringify(oauthState));

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: TWITTER_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'tweet.read tweet.write users.read offline.access',
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        force_login: 'true'
      });

      const url = `${TWITTER_AUTH_URL}?${params.toString()}`;
      console.log("Generated OAuth URL:", url);

      const width = 600;
      const height = 800;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        url,
        'Twitter Auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        throw new Error("Failed to open popup window");
      }

      return new Promise((resolve, reject) => {
        const messageHandler = async (event: MessageEvent) => {
          console.log("Received message from popup:", event);

          try {
            // Verify origin
            const allowedOrigins = [
              window.location.origin,
              'https://preview--pandapost.lovable.app'
            ];
            
            if (!allowedOrigins.includes(event.origin)) {
              console.log("Ignoring message from unauthorized origin:", event.origin);
              return;
            }

            if (event.data?.type === 'twitter_callback') {
              window.removeEventListener('message', messageHandler);
              const { code, state: receivedState } = event.data;

              if (!code || !receivedState) {
                throw new Error("Missing OAuth parameters");
              }

              // Retrieve stored OAuth state
              const storedOAuthState = localStorage.getItem('twitter_oauth_state');
              if (!storedOAuthState) {
                throw new Error("No stored OAuth state found");
              }

              const { state: originalState, codeVerifier } = JSON.parse(storedOAuthState) as OAuthState;
              if (receivedState !== originalState) {
                throw new Error("Invalid state parameter");
              }

              // Exchange code for tokens using Edge Function
              const { data: tokens, error: tokenError } = await supabase.functions.invoke('twitter', {
                body: { 
                  action: 'callback',
                  code,
                  codeVerifier
                }
              });

              if (tokenError) throw tokenError;
              console.log("Successfully connected to Twitter:", tokens);
              
              popup.close();
              toast.success("Successfully connected to Twitter!");
              resolve();
            }

            if (event.data?.type === 'twitter_callback_error') {
              window.removeEventListener('message', messageHandler);
              popup.close();
              throw new Error(event.data.error);
            }
          } catch (error) {
            console.error("Error in message handler:", error);
            window.removeEventListener('message', messageHandler);
            popup.close();
            reject(error);
          } finally {
            localStorage.removeItem('twitter_oauth_state');
          }
        };

        window.addEventListener('message', messageHandler);

        // Check if popup is closed
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            localStorage.removeItem('twitter_oauth_state');
            reject(new Error("Authentication cancelled"));
          }
        }, 1000);
      });
    } catch (error) {
      console.error("Twitter connection error:", error);
      toast.error("Failed to connect to Twitter");
      throw error;
    }
  }
}