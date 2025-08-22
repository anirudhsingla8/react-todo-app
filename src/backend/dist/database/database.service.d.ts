import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { User } from '../users/user.interface';
import { Todo } from '../todos/todo.interface';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private db;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private createTables;
    createUser(username: string, password: string): Promise<User>;
    findUserByUsername(username: string): Promise<User | undefined>;
    findUserById(id: number): Promise<User | undefined>;
    createTodo(userId: number, text: string, options?: {
        dueDate?: Date;
        tags?: string[];
        priority?: 'low' | 'medium' | 'high';
        notes?: string;
        reminder?: Date;
    }): Promise<Todo>;
    findTodosByUserId(userId: number): Promise<Todo[]>;
    updateTodoCompletion(id: number, completed: boolean): Promise<boolean>;
    updateTodo(id: number, updates: Partial<Todo>): Promise<boolean>;
    deleteTodo(id: number): Promise<boolean>;
}
