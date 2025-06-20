import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comentario } from '../schemas/comentarios.schema';
import { Model, Types } from 'mongoose';
import { CrearComentarioDto } from '../dto/crear-comentario.dto';
import { EditarComentarioDto } from '../dto/editar-comentario.dto';
import { ComentarioResponseDto } from '../dto/comentario-response.dto';

interface ComentarioConTimestamps extends Comentario {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}


@Injectable()
export class ComentariosService {
  constructor(
    @InjectModel(Comentario.name)
    private readonly comentarioModel: Model<Comentario>,
  ) {}

  async crear(publicacionId: string, autorId: string, dto: CrearComentarioDto) {
    const nuevo = new this.comentarioModel({
      mensaje: dto.mensaje,
      publicacion: new Types.ObjectId(publicacionId),
      autor: new Types.ObjectId(autorId),
    });

    return nuevo.save();
  }

  async editar(comentarioId: string, dto: EditarComentarioDto) {
    const comentario = await this.comentarioModel.findById(comentarioId);
    if (!comentario) throw new NotFoundException('Comentario no encontrado');

    comentario.mensaje = dto.mensaje;
    comentario.modificado = true;
    return comentario.save();
  }

    async listar(publicacionId: string, offset = 0, limit = 10): Promise<ComentarioResponseDto[]> {
        const comentarios = await this.comentarioModel
            .find({ publicacion: new Types.ObjectId(publicacionId) })
            .sort({ createdAt: 1 })
            .skip(offset)
            .limit(limit)
            .populate('autor', 'username profileImageUrl')
            .exec();

        return comentarios.map((comentario) => {
            const c = comentario as unknown as ComentarioConTimestamps;
            const autor = c.autor as Types.ObjectId | { _id: Types.ObjectId; username: string; profileImageUrl?: string };

            if (autor instanceof Types.ObjectId) {
                return {
                    id: c._id.toString(),
                    mensaje: c.mensaje,
                    createdAt: c.createdAt,
                    modificado: c.modificado ?? false,
                    autor: {
                        id: autor.toString(),
                        username: 'Usuario desconocido',
                        profileImageUrl: undefined,
                    }
                };
            }

            return {
                id: c._id.toString(),
                mensaje: c.mensaje,
                createdAt: c.createdAt,
                modificado: c.modificado ?? false,
                autor: {
                    id: autor._id.toString(),
                    username: autor.username,
                    profileImageUrl: autor.profileImageUrl,
                }
            };
        });
    }
}