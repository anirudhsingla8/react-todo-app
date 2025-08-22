import { Controller, Get, Post, Put, Delete, Body, Query, HttpException, HttpStatus, Param } from '@nestjs/common';
import { TodosService } from './todos.service';
import { UsersService } from '../users/users.service';
import { Todo } from './todo.interface';

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
  async createTodo(@Body() body: {
    username: string;
    text: string;
    dueDate?: string;
    tags?: string[];
    priority?: 'low' | 'medium' | 'high';
    notes?: string;
    reminder?: string;
  }) {
    const { username, text, dueDate, tags, priority, notes, reminder } = body;

    if (!username || !text) {
      throw new HttpException('Username and text are required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const todo = await this.todosService.create(user.id, text, {
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags: tags || [],
      priority: priority || 'medium',
      notes,
      reminder: reminder ? new Date(reminder) : undefined
    });
    return todo;
  }

  @Put()
  async updateTodo(@Body() body: { id: number; completed: boolean }) {
    const { id, completed } = body;

    if (id === undefined) {
      throw new HttpException('Todo ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.todosService.updateCompletion(id, completed);
      if (!result) {
        throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
      }

      return { id, completed };
    } catch (error) {
      throw new HttpException('Failed to update todo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async updateTodoFields(@Param('id') id: string, @Body() body: {
    text?: string;
    completed?: boolean;
    dueDate?: string;
    tags?: string[];
    priority?: 'low' | 'medium' | 'high';
    notes?: string;
    reminder?: string;
  }) {
    try {
      // Convert string dates to Date objects
      const updates: Partial<Todo> = {};
      
      if (body.text !== undefined) updates.text = body.text;
      if (body.completed !== undefined) updates.completed = body.completed;
      if (body.dueDate !== undefined) updates.dueDate = new Date(body.dueDate);
      if (body.tags !== undefined) updates.tags = body.tags;
      if (body.priority !== undefined) updates.priority = body.priority;
      if (body.notes !== undefined) updates.notes = body.notes;
      if (body.reminder !== undefined) updates.reminder = new Date(body.reminder);
      
      const result = await this.todosService.update(parseInt(id), updates);
      if (!result) {
        throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
      }
      
      return { message: 'Todo updated successfully' };
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