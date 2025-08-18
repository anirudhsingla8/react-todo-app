import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() body: { username: string; password: string }) {
    try {
      const { username, password } = body;
      
      if (!username || !password) {
        throw new HttpException('Username and password are required', HttpStatus.BAD_REQUEST);
      }
      
      if (password.length < 6) {
        throw new HttpException('Password must be at least 6 characters', HttpStatus.BAD_REQUEST);
      }
      
      const user = await this.usersService.create(username, password);
      return { 
        message: 'User created successfully',
        user: {
          id: user.id,
          username: user.username,
          createdAt: user.createdAt
        }
      };
    } catch (error) {
      if (error.message === 'User already exists') {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}