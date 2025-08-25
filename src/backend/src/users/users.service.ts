import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User } from './user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(username: string, password: string): Promise<User> {
    try {
      return await this.databaseService.createUser(username, password);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('User already exists');
      }
      throw error;
    }
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return await this.databaseService.findUserByUsername(username);
  }

  async findOneById(id: number): Promise<User | undefined> {
    return await this.databaseService.findUserById(id);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findOneByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== password) {
      throw new Error('Incorrect password');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return user;
  }
}