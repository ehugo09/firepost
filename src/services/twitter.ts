import { supabase } from "@/integrations/supabase/client";
import { getTwitterAuthUrl } from "@/utils/twitter/oauth";

interface TwitterTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export class TwitterService {
  static async initiateAuth(): Promise<void> {
    try {
      console.log('Initiating Twitter OAuth flow...');
      const authUrl = await getTwitterAuthUrl();
      console.log('Generated Twitter auth URL:', authUrl);
      
      // Open popup window
      const width = 600;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        authUrl,
        'Twitter Auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        console.error('Popup was blocked by the browser');
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      console.log('OAuth popup opened successfully');

      // Simple interval to check if popup is closed
      const checkPopupInterval = setInterval(() => {
        if (popup.closed) {
          console.log('OAuth popup closed');
          clearInterval(checkPopupInterval);
        }
      }, 1000);

    } catch (error) {
      console.error('Error in initiateAuth:', error);
      throw error;
    }
  }

  static async handleCallback(code: string, state: string): Promise<void> {
    try {
      console.log('Starting callback handling with code:', code);
      
      // Verify state
      const storedState = sessionStorage.getItem('twitter_oauth_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }

      // Get code verifier
      const codeVerifier = sessionStorage.getItem('twitter_oauth_verifier');
      if (!codeVerifier) {
        throw new Error('Missing code verifier');
      }

      // Exchange code for tokens
      const { data, error } = await supabase.functions.invoke<TwitterTokenResponse>('twitter-auth', {
        body: { code, codeVerifier }
      });

      if (error) throw error;
      if (!data) throw new Error('No data received from token exchange');

      // Clean up
      sessionStorage.removeItem('twitter_oauth_state');
      sessionStorage.removeItem('twitter_oauth_verifier');

      console.log('Twitter authentication completed successfully');

    } catch (error) {
      console.error('Error in handleCallback:', error);
      throw error;
    }
  }
}