import { supabase } from "@/integrations/supabase/client";
import { TWITTER_CONFIG } from "@/config/twitter";

export class TwitterService {
  static async initiateAuth(): Promise<void> {
    try {
      console.log('Starting Twitter auth flow...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.error('No authenticated user found');
        throw new Error('No authenticated user found');
      }

      const state = crypto.randomUUID();
      console.log('Generated state:', state);
      sessionStorage.setItem('twitter_oauth_state', state);

      const codeVerifier = this.generateCodeVerifier();
      const codeChallenge = await this.generateCodeChallenge(codeVerifier);
      console.log('Generated PKCE values');
      sessionStorage.setItem('twitter_oauth_verifier', codeVerifier);
      sessionStorage.setItem('user_id', session.user.id);

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: TWITTER_CONFIG.clientId,
        redirect_uri: TWITTER_CONFIG.redirectUri,
        scope: TWITTER_CONFIG.scope,
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        force_login: 'true'
      });

      const authUrl = `${TWITTER_CONFIG.authUrl}?${params.toString()}`;
      console.log('Redirecting to Twitter auth URL:', authUrl);
      window.location.href = authUrl;

    } catch (error) {
      console.error('Error initiating Twitter auth:', error);
      throw error;
    }
  }

  static async handleCallback(code: string, state: string): Promise<void> {
    try {
      console.log('Processing Twitter callback...');
      
      const storedState = sessionStorage.getItem('twitter_oauth_state');
      if (state !== storedState) {
        console.error('State mismatch:', { received: state, stored: storedState });
        throw new Error('Invalid state parameter');
      }

      const codeVerifier = sessionStorage.getItem('twitter_oauth_verifier');
      const userId = sessionStorage.getItem('user_id');
      
      if (!codeVerifier || !userId) {
        console.error('Missing required session data');
        throw new Error('Missing required session data');
      }

      console.log('Calling twitter-auth function with:', { 
        code: code.substring(0, 10) + '...',
        userId,
        codeVerifier: codeVerifier.substring(0, 10) + '...'
      });

      // Modification importante ici : ajout des headers et du mode de la requête
      const { data, error } = await supabase.functions.invoke('twitter-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { 
          code,
          codeVerifier,
          userId
        }
      });

      if (error) {
        console.error('Error from twitter-auth function:', error);
        throw error;
      }

      console.log('Response from twitter-auth function:', data);

      console.log('Successfully authenticated with Twitter');
      sessionStorage.removeItem('twitter_oauth_state');
      sessionStorage.removeItem('twitter_oauth_verifier');
      sessionStorage.removeItem('user_id');

    } catch (error) {
      console.error('Error in callback:', error);
      throw error;
    }
  }

  private static generateCodeVerifier(length = 128): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array)
      .map(x => charset[x % charset.length])
      .join('');
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