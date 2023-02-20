export interface User {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  sub: string;
  roles: Array<string>;
  login?:number|string;
}

export interface Token {
  username: string;
  accessToken: string;
  refreshToken: string;
  expired: number;
}
