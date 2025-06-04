import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
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

}
