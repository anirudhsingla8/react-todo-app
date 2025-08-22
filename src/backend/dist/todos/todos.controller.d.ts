import { TodosService } from './todos.service';
import { UsersService } from '../users/users.service';
import { Todo } from './todo.interface';
export declare class TodosController {
    private readonly todosService;
    private readonly usersService;
    constructor(todosService: TodosService, usersService: UsersService);
    getTodos(username: string): Promise<Todo[]>;
    createTodo(body: {
        username: string;
        text: string;
        dueDate?: string;
        tags?: string[];
        priority?: 'low' | 'medium' | 'high';
        notes?: string;
        reminder?: string;
    }): Promise<Todo>;
    updateTodo(body: {
        id: number;
        completed: boolean;
    }): Promise<{
        id: number;
        completed: boolean;
    }>;
    updateTodoFields(id: string, body: {
        text?: string;
        completed?: boolean;
        dueDate?: string;
        tags?: string[];
        priority?: 'low' | 'medium' | 'high';
        notes?: string;
        reminder?: string;
    }): Promise<{
        message: string;
    }>;
    deleteTodo(body: {
        id: number;
    }): Promise<{
        message: string;
    }>;
}
