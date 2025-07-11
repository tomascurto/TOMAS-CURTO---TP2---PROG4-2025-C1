import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../../../cloudinary/cloudinary.service';
import { CrearPublicacionDto } from '../../../publicaciones/dto/crear-publicacion.dto/crear-publicacion.dto';
import { Publicacion } from '../../../publicaciones/schemas/publicacion.schema/publicacion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { ConflictException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UnauthorizedException } from '@nestjs/common';

const usuarioId = new Types.ObjectId('64b5f60d1e3c2c456789abcd');

@Injectable()
export class PublicacionesService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Publicacion.name)
    private readonly publicacionModel: Model<Publicacion>,
  ) {}
  async crearPublicacion(
    dto: CrearPublicacionDto,
    usuarioId: string,
    imagen?: Express.Multer.File,
  ) {
    let imagenUrl: string | undefined = undefined;

    if (imagen) {
      imagenUrl = await this.cloudinaryService.uploadImage(
        imagen,
        'publicaciones',
      );
    }

    const autorId = Types.ObjectId.isValid(usuarioId)
      ? new Types.ObjectId(usuarioId)
      : null;

    if (!autorId) {
      throw new Error('El usuarioId no es un ObjectId válido');
    }

    const nueva = new this.publicacionModel({
      ...dto,
      imagenUrl,
      autor: autorId,
    });

    return nueva.save();
  }

  async bajaLogica(id: string, usuarioId: string, esAdmin: boolean = false) {
    const publicacion = await this.publicacionModel.findById(id);
    if (!publicacion) throw new NotFoundException('Publicación no encontrada');

    if (publicacion.autor.toString() !== usuarioId && !esAdmin) {
      throw new UnauthorizedException('No tienes permisos');
    }

    publicacion.activo = false;
    return publicacion.save();
  }

  async altaLogica(id: string, usuarioId: string, esAdmin = false) {
    const publicacion = await this.publicacionModel.findById(id);
    if (!publicacion) throw new NotFoundException('Publicación no encontrada');

    if (publicacion.autor.toString() !== usuarioId && !esAdmin) {
      throw new NotFoundException(
        'No tienes permisos para reactivar esta publicación',
      );
    }

    publicacion.activo = true;
    return publicacion.save();
  }

  async listarPublicaciones(
    orden: 'fecha' | 'likes',
    usuarioId?: string,
    offset = 0,
    limit = 10,
  ) {
    const filtro: any = { activo: true };
    if (usuarioId) filtro.autor = usuarioId;

    if (orden === 'likes') {
      const pipeline: any[] = [];

      if (usuarioId) {
        pipeline.push({ $match: filtro });
      } else {
        pipeline.push({ $match: { activo: true } });
      }

      pipeline.push(
        {
          $addFields: {
            likesCount: { $size: '$likes' },
          },
        },
        { $sort: { likesCount: -1 } },
        { $skip: offset },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'autor',
            foreignField: '_id',
            as: 'autor',
          },
        },
        {
          $unwind: {
            path: '$autor',
            preserveNullAndEmptyArrays: true,
          },
        },
      );

      return this.publicacionModel.aggregate(pipeline);
    }

    return this.publicacionModel
      .find(filtro)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate('autor', 'firstName lastName username profileImageUrl')
      .exec();
  }

  async darLike(publicacionId: string, usuarioId: string) {
    const publicacion = await this.publicacionModel.findById(publicacionId);
    if (!publicacion) throw new NotFoundException('Publicación no encontrada');

    const objectId = new Types.ObjectId(usuarioId);

    if (publicacion.likes.includes(objectId)) {
      throw new ConflictException('Ya diste like a esta publicación');
    }

    publicacion.likes.push(objectId);
    return publicacion.save();
  }

  async quitarLike(publicacionId: string, usuarioId: string) {
    const publicacion = await this.publicacionModel.findById(publicacionId);
    if (!publicacion) throw new NotFoundException('Publicación no encontrada');

    const objectId = new Types.ObjectId(usuarioId);

    if (!publicacion.likes.includes(objectId)) {
      throw new NotFoundException('No habías dado like a esta publicación');
    }

    publicacion.likes = publicacion.likes.filter((id) => !id.equals(objectId));
    return publicacion.save();
  }

  async obtenerPorId(id: string) {
    const pub = await this.publicacionModel
      .findById(id)
      .populate('autor', 'firstName lastName username profileImageUrl')
      .exec();

    if (!pub) throw new NotFoundException('Publicación no encontrada');
    return pub;
  }

  async editarPublicacion(
    id: string,
    dto: CrearPublicacionDto,
    usuarioId: string,
  ) {
    const publicacion = await this.publicacionModel.findById(id);
    if (!publicacion) throw new NotFoundException('Publicación no encontrada');

    if (publicacion.autor.toString() !== usuarioId)
      throw new UnauthorizedException('No puedes editar esta publicación');

    publicacion.titulo = dto.titulo;
    publicacion.mensaje = dto.mensaje;

    return publicacion.save();
  }

  async listarPorEstado(
  activo: boolean,
  usuarioId: string | null,
  esAdmin = false,
  offset = 0,
  limit = 10,
) {
    const filtro: any = { activo };
    if (!esAdmin && usuarioId) filtro.autor = new Types.ObjectId(usuarioId);

    return this.publicacionModel
      .find(filtro)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate('autor', 'firstName lastName username profileImageUrl')
      .exec();
  }
}
