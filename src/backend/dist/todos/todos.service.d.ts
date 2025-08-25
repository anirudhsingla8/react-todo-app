import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { Todo, TodoDocument } from './todo.schema';
export declare class TodosService {
    private todoModel;
    private readonly usersService;
    constructor(todoModel: Model<TodoDocument>, usersService: UsersService);
    create(userId: string, text: string, options?: {
        dueDate?: Date;
        tags?: string[];
        priority?: 'low' | 'medium' | 'high';
        notes?: string;
        reminder?: Date;
    }): Promise<Todo>;
    findAllByUserId(userId: string): Promise<Todo[]>;
    updateCompletion(id: string, completed: boolean): Promise<boolean>;
    update(id: string, updates: Partial<Todo>): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}
