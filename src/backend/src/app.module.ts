import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://myAtlasDBUser:rj13sl1608@cluster0.whgoitb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    UsersModule,
    TodosModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}