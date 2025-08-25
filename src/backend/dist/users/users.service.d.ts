import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(username: string, password: string): Promise<User>;
    findOneByUsername(username: string): Promise<User | undefined>;
    findOneById(id: string): Promise<User | undefined>;
    validateUser(username: string, password: string): Promise<User | null>;
}
