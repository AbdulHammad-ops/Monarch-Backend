export type AuthProvider = 'github' | 'google';
export type JwtPayload = {
  sub: string;
  iat?: number;
  exp?: number;
  external_id: string;
  stripe_customer_id: string;
  photo?: string;
};
