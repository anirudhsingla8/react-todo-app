import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { Todo, TodoDocument } from './todo.schema';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: string, text: string, options?: {
    dueDate?: Date;
    tags?: string[];
    priority?: 'low' | 'medium' | 'high';
    notes?: string;
    reminder?: Date;
  }): Promise<Todo> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const newTodo = new this.todoModel({
      userId,
      text,
      ...options,
    });
    return newTodo.save();
  }

  async findAllByUserId(userId: string): Promise<Todo[]> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return this.todoModel.find({ userId }).exec();
  }

  async updateCompletion(id: string, completed: boolean): Promise<boolean> {
    const result = await this.todoModel.updateOne({ _id: id }, { completed, completedAt: completed ? new Date() : null }).exec();
    return result.acknowledged && result.modifiedCount > 0;
  }

  async update(id: string, updates: Partial<Todo>): Promise<boolean> {
    const result = await this.todoModel.updateOne({ _id: id }, updates).exec();
    return result.acknowledged && result.modifiedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.todoModel.deleteOne({ _id: id }).exec();
    return result.acknowledged && result.deletedCount > 0;
  }
}