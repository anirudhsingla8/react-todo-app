import { Controller, Get, Post, Put, Delete, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { TodosService } from './todos.service';
import { UsersService } from '../users/users.service';

@Controller('todos')
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getTodos(@Query('username') username: string) {
    if (!username) {
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const todos = await this.todosService.findAllByUserId(user.id);
    return todos;
  }

  @Post()
  async createTodo(@Body() body: { username: string; text: string }) {
    const { username, text } = body;

    if (!username || !text) {
      throw new HttpException('Username and text are required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const todo = await this.todosService.create(user.id, text);
    return todo;
  }

  @Put()
  async updateTodo(@Body() body: { id: number; completed: boolean }) {
    const { id, completed } = body;

    if (id === undefined) {
      throw new HttpException('Todo ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.todosService.update(id, completed);
      if (!result) {
        throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
      }

      return { id, completed };
    } catch (error) {
      throw new HttpException('Failed to update todo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete()
  async deleteTodo(@Body() body: { id: number }) {
    const { id } = body;

    if (id === undefined) {
      throw new HttpException('Todo ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.todosService.delete(id);
      if (!result) {
        throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
      }

      return { message: 'Todo deleted successfully' };
    } catch (error) {
      throw new HttpException('Failed to delete todo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}