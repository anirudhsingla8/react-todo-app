import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly usersService;
    constructor(usersService: UsersService);
    validateUser(username: string, pass: string): Promise<any>;
}
