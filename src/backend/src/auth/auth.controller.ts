import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    try {
      const { username, password } = body;
      
      if (!username || !password) {
        throw new HttpException('Username and password are required', HttpStatus.BAD_REQUEST);
      }
      
      const user = await this.usersService.validateUser(username, password);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        user: {
          id: userWithoutPassword.id,
          username: userWithoutPassword.username,
          createdAt: userWithoutPassword.createdAt
        },
        message: 'Login successful'
      };
    } catch (error) {
      if (error.message === 'User not found' || error.message === 'Incorrect password') {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}