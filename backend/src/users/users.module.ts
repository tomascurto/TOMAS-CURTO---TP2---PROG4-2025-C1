import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { PublicacionesModule } from '../publicaciones/publicaciones.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), PublicacionesModule
  ],
  controllers: [UsersController],

  providers: [UsersService],
  exports: [MongooseModule, UsersService], 
})
export class UsersModule {}