export interface User {
    id: number;
    username: string;
    email?: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    lastLogin?: Date;
    isVerified: boolean;
    failedLoginAttempts: number;
    lockedUntil?: Date;
}
