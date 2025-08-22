import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly usersService;
    constructor(usersService: UsersService);
    validateUser(username: string, password: string): Promise<any>;
}
