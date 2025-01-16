import { supabase } from "@/integrations/supabase/client";
import { TWITTER_CONFIG } from "@/config/twitter";

export class TwitterService {
  static async initiateAuth(): Promise<void> {
    try {
      console.log('Starting Twitter auth flow...');
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
      
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
      console.log('Stored user ID in session:', session.user.id);

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
      console.log('Processing Twitter callback with code:', code.substring(0, 10) + '...');
      
      const storedState = sessionStorage.getItem('twitter_oauth_state');
      console.log('Verifying state:', { received: state, stored: storedState });
      
      if (state !== storedState) {
        console.error('State mismatch:', { received: state, stored: storedState });
        throw new Error('Invalid state parameter');
      }

      const codeVerifier = sessionStorage.getItem('twitter_oauth_verifier');
      const userId = sessionStorage.getItem('user_id');
      console.log('Retrieved from session:', { codeVerifier: codeVerifier?.substring(0, 10) + '...', userId });
      
      if (!codeVerifier || !userId) {
        console.error('Missing required session data');
        throw new Error('Missing required session data');
      }

      console.log('Exchanging code for tokens...');
      const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: TWITTER_CONFIG.clientId,
          redirect_uri: TWITTER_CONFIG.redirectUri,
          code_verifier: codeVerifier,
          code: code,
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text();
        console.error('Token exchange failed:', errorData);
        throw new Error('Failed to exchange code for tokens');
      }

      const tokens = await tokenResponse.json();
      console.log('Successfully obtained tokens');

      console.log('Fetching user info...');
      const userResponse = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      });

      if (!userResponse.ok) {
        console.error('Failed to fetch user info:', await userResponse.text());
        throw new Error('Failed to fetch user info');
      }

      const userData = await userResponse.json();
      console.log('Successfully fetched user info:', userData);

      console.log('Storing connection in Supabase...');
      const { error: dbError } = await supabase
        .from('social_connections')
        .upsert({
          user_id: userId,
          platform: 'twitter',
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expires_at: new Date(Date.now() + (tokens.expires_in * 1000)).toISOString(),
          platform_user_id: userData.data.id,
          username: userData.data.username,
          twitter_credentials: {
            id: userData.data.id,
            username: userData.data.username,
            name: userData.data.name,
          },
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      console.log('Cleaning up session storage...');
      sessionStorage.removeItem('twitter_oauth_state');
      sessionStorage.removeItem('twitter_oauth_verifier');
      sessionStorage.removeItem('user_id');

      console.log('Twitter authentication completed successfully');
      window.location.href = '/dashboard';
      
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