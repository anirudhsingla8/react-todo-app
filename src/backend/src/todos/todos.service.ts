import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UsersService } from '../users/users.service';
import { Todo } from './todo.interface';

@Injectable()
export class TodosService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, text: string): Promise<Todo> {
    // Verify user exists
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return await this.databaseService.createTodo(userId, text);
  }

  async findAllByUserId(userId: number): Promise<Todo[]> {
    // Verify user exists
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return await this.databaseService.findTodosByUserId(userId);
  }

  async update(id: number, completed: boolean): Promise<boolean> {
    return await this.databaseService.updateTodo(id, completed);
  }

  async delete(id: number): Promise<boolean> {
    return await this.databaseService.deleteTodo(id);
  }
}