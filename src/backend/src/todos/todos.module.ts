import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [UsersModule, DatabaseModule],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}