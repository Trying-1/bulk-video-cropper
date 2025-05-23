export interface User {
  uid: string;
  email: string | null;
  username: string;
  createdAt: Date;
  subscription: 'free' | 'premium' | 'pro';
  usedQuota: number;
  nextRenewal: string;
  emailVerified: boolean;
}
