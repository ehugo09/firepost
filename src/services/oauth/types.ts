export interface OAuthState {
  codeVerifier: string;
  state: string;
}

export interface TwitterCredentials {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}