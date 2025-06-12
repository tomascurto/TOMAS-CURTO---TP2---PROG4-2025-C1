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
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface RequestWithUser extends Request {
  user: UserPayload;
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

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
      const imageUrl = await this.uploadToCloudinary(file);
      registroUserDto.profileImageUrl = imageUrl;
    }

    return this.authService.registro(registroUserDto);
  }

  private uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'profile-images',
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) return reject(new Error('Error al subir la imagen a Cloudinary'));
          resolve(result.secure_url);
        },
      );

      Readable.from(file.buffer).pipe(stream);
    });
  }

}
