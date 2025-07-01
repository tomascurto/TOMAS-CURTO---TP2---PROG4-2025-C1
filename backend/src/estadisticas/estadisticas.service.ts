import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacion } from '../publicaciones/schemas/publicacion.schema/publicacion.schema';
import { Comentario } from '../comentarios/schemas/comentarios.schema';
import { Model } from 'mongoose';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel(Publicacion.name)
    private readonly publicacionModel: Model<Publicacion>,
    @InjectModel(Comentario.name)
    private readonly comentarioModel: Model<Comentario>,
  ) {}

  async publicacionesPorUsuario(desde: Date, hasta: Date) {
    return this.publicacionModel.aggregate([
      {
        $match: {
          createdAt: { $gte: desde, $lte: hasta },
          activo: true,
        },
      },
      {
        $group: {
          _id: '$autor',
          cantidad: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'autor',
        },
      },
      { $unwind: '$autor' },
      {
        $project: {
          _id: 0,
          usuario: '$autor.username',
          cantidad: 1,
        },
      },
    ]);
  }

  async totalComentarios(desde: Date, hasta: Date) {
    const cantidad = await this.comentarioModel.countDocuments({
      createdAt: { $gte: desde, $lte: hasta },
    });
    return { cantidad };
  }

  async comentariosPorPublicacion(desde: Date, hasta: Date) {
    return this.comentarioModel.aggregate([
      {
        $match: {
          createdAt: { $gte: desde, $lte: hasta },
        },
      },
      {
        $group: {
          _id: '$publicacion',
          cantidad: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'publicaciones',
          localField: '_id',
          foreignField: '_id',
          as: 'publicacion',
        },
      },
      { $unwind: '$publicacion' },
      {
        $project: {
          _id: 0,
          publicacion: '$publicacion.titulo',
          cantidad: 1,
        },
      },
    ]);
  }
}