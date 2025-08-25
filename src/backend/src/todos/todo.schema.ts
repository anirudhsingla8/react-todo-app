import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../users/user.schema';

export type TodoDocument = Todo & Document;

@Schema({ timestamps: true })
export class Todo {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  text: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop()
  completedAt: Date;

  @Prop()
  dueDate: Date;

  @Prop([String])
  tags: string[];

  @Prop({ default: 'medium' })
  priority: 'low' | 'medium' | 'high';

  @Prop()
  notes: string;

  @Prop()
  reminder: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
