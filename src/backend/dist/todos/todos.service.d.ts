import { DatabaseService } from '../database/database.service';
import { UsersService } from '../users/users.service';
import { Todo } from './todo.interface';
export declare class TodosService {
    private readonly databaseService;
    private readonly usersService;
    constructor(databaseService: DatabaseService, usersService: UsersService);
    create(userId: number, text: string, options?: {
        dueDate?: Date;
        tags?: string[];
        priority?: 'low' | 'medium' | 'high';
        notes?: string;
        reminder?: Date;
    }): Promise<Todo>;
    findAllByUserId(userId: number): Promise<Todo[]>;
    updateCompletion(id: number, completed: boolean): Promise<boolean>;
    update(id: number, updates: Partial<Todo>): Promise<boolean>;
    delete(id: number): Promise<boolean>;
}
