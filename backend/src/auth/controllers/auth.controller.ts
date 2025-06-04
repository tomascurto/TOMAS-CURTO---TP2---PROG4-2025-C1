import { Controller, Post, Body, BadRequestException, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegistroUserDto } from '../dto/registro.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserPayload } from '../interfaces/user-payload.interface';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: UserPayload;
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}


    @UseGuards(AuthGuard('jwt'))

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
    async register(@Body() createUserDto: RegistroUserDto) {
        return this.authService.registro(createUserDto);
    }

}
