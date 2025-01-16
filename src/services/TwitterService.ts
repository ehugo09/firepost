import { supabase } from "@/integrations/supabase/client";
import { TWITTER_CONFIG } from "@/config/twitter";
import { generateCodeVerifier, generateCodeChallenge, generateState } from "@/utils/oauth";
import { toast } from "sonner";

export class TwitterService {
  private static async createAuthUrl(): Promise<{ url: string; state: string; codeVerifier: string }> {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: TWITTER_CONFIG.clientId,
      redirect_uri: TWITTER_CONFIG.redirectUri,
      scope: TWITTER_CONFIG.scope,
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    return {
      url: `${TWITTER_CONFIG.authUrl}?${params.toString()}`,
      state,
      codeVerifier
    };
  }

  static async connect(): Promise<void> {
    console.log("Starting Twitter connection process...");
    try {
      const { url, state, codeVerifier } = await this.createAuthUrl();
      
      // Store state and verifier
      localStorage.setItem('twitter_oauth_state', state);
      localStorage.setItem('twitter_code_verifier', codeVerifier);
      
      const width = 600;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        url,
        'Twitter Auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        throw new Error("Failed to open authentication window");
      }

      return new Promise((resolve, reject) => {
        const messageHandler = async (event: MessageEvent) => {
          try {
            if (event.origin !== window.location.origin) {
              console.log("Ignoring message from unauthorized origin:", event.origin);
              return;
            }

            if (event.data?.type === 'twitter_callback') {
              const { code, state: receivedState } = event.data;
              
              if (!code || !receivedState) {
                throw new Error("Missing OAuth parameters");
              }

              const storedState = localStorage.getItem('twitter_oauth_state');
              if (receivedState !== storedState) {
                throw new Error("Invalid state parameter");
              }

              window.removeEventListener('message', messageHandler);
              await this.handleCallback(code);
              popup.close();
              resolve();
            }
          } catch (error) {
            console.error("Error in message handler:", error);
            reject(error);
          }
        };

        window.addEventListener('message', messageHandler);

        // Check if popup is closed
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            localStorage.removeItem('twitter_oauth_state');
            localStorage.removeItem('twitter_code_verifier');
            reject(new Error("Authentication cancelled"));
          }
        }, 1000);
      });
    } catch (error) {
      console.error("Twitter connection error:", error);
      throw error;
    }
  }

  private static async handleCallback(code: string): Promise<void> {
    console.log("Handling Twitter callback with code:", code);
    try {
      const codeVerifier = localStorage.getItem('twitter_code_verifier');
      if (!codeVerifier) {
        throw new Error("Code verifier not found");
      }

      const { data: callbackData, error: callbackError } = await supabase.functions.invoke('twitter', {
        body: { 
          action: 'callback',
          code,
          codeVerifier
        }
      });

      if (callbackError) throw callbackError;

      console.log("Successfully connected to Twitter:", callbackData);
      toast.success("Successfully connected to Twitter!");

      // Clean up
      localStorage.removeItem('twitter_oauth_state');
      localStorage.removeItem('twitter_code_verifier');
    } catch (error) {
      console.error("Twitter callback error:", error);
      toast.error("Failed to connect to Twitter");
      throw error;
    }
  }
}