import { Controller } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  obtenerPerfil(@Req() req: RequestWithUser) {
    return this.usersService.obtenerPerfilCompleto(req.user!.userId);
  }    
}
