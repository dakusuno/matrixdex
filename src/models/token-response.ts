export interface Token {
  session: string;
  refresh: string;
}

export interface TokenResponse {
  token: Token;
}
