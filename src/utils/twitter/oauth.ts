// Twitter OAuth utilities
export const generateCodeVerifier = (length: number = 128): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

export const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const generateState = (): string => {
  return crypto.randomUUID();
};

export const getTwitterAuthUrl = async (): Promise<string> => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  // Store PKCE values in sessionStorage
  sessionStorage.setItem('twitter_oauth_state', state);
  sessionStorage.setItem('twitter_oauth_verifier', codeVerifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: 'akNKemhMMnZBdlJTYzliRjRtd1o6MTpjaQ',
    redirect_uri: `${window.location.origin}/auth/callback/twitter`,
    scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'].join(' '),
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    force_login: 'true' // Force Twitter to show auth screen
  });

  return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
};