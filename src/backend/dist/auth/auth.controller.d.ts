import { UsersService } from '../users/users.service';
export declare class AuthController {
    private readonly usersService;
    constructor(usersService: UsersService);
    login(body: {
        username: string;
        password: string;
    }): Promise<{
        user: {
            id: number;
            username: string;
            createdAt: Date;
        };
        message: string;
    }>;
}
