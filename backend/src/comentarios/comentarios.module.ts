import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comentario, ComentarioSchema } from './schemas/comentarios.schema';
import { ComentariosController } from './controller/comentarios.controller';
import { ComentariosService } from './service/comentarios.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Comentario.name, schema: ComentarioSchema }])],
  controllers: [ComentariosController],
  providers: [ComentariosService],
})
export class ComentariosModule {}
