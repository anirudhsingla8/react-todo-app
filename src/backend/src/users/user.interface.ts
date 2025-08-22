export interface User {
  id: number;
  username: string;
  email?: string;
  password: string; // In a real app, this would be hashed
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isVerified: boolean;
  failedLoginAttempts: number;
  lockedUntil?: Date;
}