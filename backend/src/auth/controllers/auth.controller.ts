import { Controller, Post, Body, BadRequestException, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegistroUserDto } from '../dto/registro.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserPayload } from '../interfaces/user-payload.interface';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
      storage: diskStorage({
        destination: './uploads/profile-images',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
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
      registroUserDto.profileImageUrl = `/uploads/profile-images/${file.filename}`;
    }
    return this.authService.registro(registroUserDto);
  }

}
