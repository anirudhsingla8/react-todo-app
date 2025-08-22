import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    signup(body: {
        username: string;
        password: string;
    }): Promise<{
        message: string;
        user: {
            id: number;
            username: string;
            createdAt: Date;
        };
    }>;
}
