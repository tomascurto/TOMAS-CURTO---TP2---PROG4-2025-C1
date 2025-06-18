import { Controller, Post, Body, BadRequestException, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegistroUserDto } from '../dto/registro.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserPayload } from '../interfaces/user-payload.interface';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { extname } from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { Readable } from 'stream';
import { JwtAuthGuard } from '../jwt-auth.guard';

interface RequestWithUser extends Request {
  user: UserPayload;
}

@Controller('auth')
export class AuthController {
    constructor(
      private authService: AuthService,
      private cloudinaryService: CloudinaryService,
    ) {}

    @Post('autorizar')
    autorizar(@Req() req: RequestWithUser) {
        return {
        message: 'Token válido',
        user: req.user,
        };
    }

    @Post('refrescar')
        async refrescar(@Req() req: RequestWithUser) {
        const user = req.user;
        const newToken = this.authService.generarToken(user);
        return {
            message: 'Token refrescado',
            token: newToken,
        };
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const { usernameOrEmail, password } = loginDto;

        if (!usernameOrEmail || !password) {
        throw new BadRequestException('Faltan credenciales');
        }

        return this.authService.login(usernameOrEmail, password);
    }

    @Post('registro')
     @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: multer.memoryStorage(), 
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Solo se permiten archivos de imagen'), false);
        }
        cb(null, true);
      },
    }),
  )
  async registro(
    @UploadedFile() file: Express.Multer.File,
    @Body() registroUserDto: RegistroUserDto,
  ) {
    if (file) {
      const imageUrl = await this.cloudinaryService.uploadImage(file, 'profile-images');
      registroUserDto.profileImageUrl = imageUrl;
    }

    return this.authService.registro(registroUserDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: RequestWithUser) {
    return {
      message: 'Logout exitoso (token aún válido, solo se debe eliminar del cliente)',
      user: req.user,
    };
  }
 
}
 