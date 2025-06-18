import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicacionesController } from './controller/publicaciones/publicaciones.controller';
import { PublicacionesService } from './service/publicaciones/publicaciones.service';
import { Publicacion, PublicacionSchema } from './schemas/publicacion.schema/publicacion.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema }, 
    ]),
    CloudinaryModule,
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}