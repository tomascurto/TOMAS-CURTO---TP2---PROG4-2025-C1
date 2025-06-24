import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CrearUsuarioAdminDto {
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  birthDate?: Date;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser "usuario" o "administrador"' })
  role?: UserRole;
}
