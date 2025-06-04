import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  USUARIO = 'usuario',
  ADMIN = 'administrador',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true, unique: true })
  username!: string;

  @Prop({ required: true })
  password!: string;

  @Prop()
  profileImageUrl?: string;

  @Prop()
  birthDate?: Date;

  @Prop()
  bio?: string;

  @Prop({ default: UserRole.USUARIO })
  role!: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
