import { supabase } from "@/integrations/supabase/client";
import { TWITTER_CONFIG } from "@/config/twitter";

export class TwitterService {
  static async initiateAuth(): Promise<void> {
    try {
      console.log('Starting Twitter auth flow...');
      
      // Generate PKCE values
      const state = crypto.randomUUID();
      const codeVerifier = this.generateCodeVerifier();
      const codeChallenge = await this.generateCodeChallenge(codeVerifier);
      
      // Store PKCE values
      sessionStorage.setItem('twitter_oauth_state', state);
      sessionStorage.setItem('twitter_oauth_verifier', codeVerifier);
      
      // Build auth URL with all required parameters
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: TWITTER_CONFIG.clientId,
        redirect_uri: TWITTER_CONFIG.redirectUri,
        scope: TWITTER_CONFIG.scope,
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        force_login: TWITTER_CONFIG.forceLogin ? 'true' : 'false'
      });

      const authUrl = `${TWITTER_CONFIG.authUrl}?${params.toString()}`;
      console.log('Generated auth URL:', authUrl);

      // Redirect to Twitter auth page
      window.location.href = authUrl;
      
    } catch (error) {
      console.error('Error initiating Twitter auth:', error);
      throw error;
    }
  }

  static async handleCallback(code: string, state: string): Promise<void> {
    try {
      console.log('Processing Twitter callback...');
      
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
      const { data, error } = await supabase.functions.invoke('twitter-auth', {
        body: { code, codeVerifier }
      });

      if (error) throw error;
      if (!data) throw new Error('No data received from token exchange');

      // Clean up
      sessionStorage.removeItem('twitter_oauth_state');
      sessionStorage.removeItem('twitter_oauth_verifier');

      console.log('Twitter authentication completed successfully');
      
    } catch (error) {
      console.error('Error in callback:', error);
      throw error;
    }
  }

  private static generateCodeVerifier(length: number = 128): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
  }

  private static async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}