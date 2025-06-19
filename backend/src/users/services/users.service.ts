import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { UserDocument } from '../schemas/user.schema';
import { Types } from 'mongoose';
import { Publicacion } from '../../publicaciones/schemas/publicacion.schema/publicacion.schema';


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Publicacion.name) private publicacionModel: Model<any>,

    ) {}

    async findByUsernameOrEmail(usernameOrEmail: string): Promise<UserDocument | null> {
        return this.userModel.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        }).exec();
    }

    async create(userData: Partial<User>): Promise<UserDocument> {
        const createdUser = new this.userModel(userData);
        return createdUser.save();
    }

    async obtenerPerfilCompleto(userId: string) {
        const user = await this.userModel.findById(userId).lean().exec();
        const publicaciones = await this.publicacionModel.aggregate([
            { $match: { autor: new Types.ObjectId(userId), activo: true } },
            { $sort: { createdAt: -1 } },
            { $limit: 3 },
            {
            $lookup: {
                from: 'comentarios',
                localField: '_id',
                foreignField: 'publicacion',
                as: 'comentarios',
            },
            },
            {
            $lookup: {
                from: 'usuarios',
                localField: 'comentarios.autor',
                foreignField: '_id',
                as: 'comentariosUsuarios',
            },
            },
            {
            $addFields: {
                comentarios: {
                $map: {
                    input: '$comentarios',
                    as: 'c',
                    in: {
                    _id: '$$c._id',
                    mensaje: '$$c.mensaje',
                    createdAt: '$$c.createdAt',
                    autor: {
                        _id: {
                        $arrayElemAt: [
                            {
                            $filter: {
                                input: '$comentariosUsuarios',
                                as: 'u',
                                cond: { $eq: ['$$u._id', '$$c.autor'] }
                            }
                            }, 0
                        ]
                        },
                        username: true
                    }
                    }
                }
                }
            }
            },
            {
            $project: {
                comentariosUsuarios: 0
            }
            }
        ]);

        return { user, publicaciones };
    }

}
