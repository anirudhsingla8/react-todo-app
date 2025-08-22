import { DatabaseService } from '../database/database.service';
import { User } from './user.interface';
export declare class UsersService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(username: string, password: string): Promise<User>;
    findOneByUsername(username: string): Promise<User | undefined>;
    findOneById(id: number): Promise<User | undefined>;
    validateUser(username: string, password: string): Promise<User | null>;
}
