import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  lastLogin: Date;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: 0 })
  failedLoginAttempts: number;

  @Prop()
  lockedUntil: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
