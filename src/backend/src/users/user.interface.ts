export interface User {
  id: number;
  username: string;
  password: string; // In a real app, this would be hashed
  createdAt: Date;
}