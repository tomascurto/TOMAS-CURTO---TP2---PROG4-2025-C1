import { IsNotEmpty, IsString } from 'class-validator';

export class CrearPublicacionDto {
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @IsString()
  titulo!: string;

  @IsNotEmpty({ message: 'El mensaje es obligatorio' })
  @IsString()
  mensaje!: string;
}