import { IsNotEmpty, IsString } from 'class-validator';

export class CrearPublicacionDto {
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @IsString()
  @IsNotEmpty()
  mensaje!: string;
}
