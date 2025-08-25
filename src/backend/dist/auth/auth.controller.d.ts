import { UsersService } from '../users/users.service';
export declare class AuthController {
    private readonly usersService;
    constructor(usersService: UsersService);
    login(body: {
        username: string;
        password: string;
    }): Promise<{
        user: {
            id: any;
            username: string;
            createdAt: any;
        };
        message: string;
    }>;
}
