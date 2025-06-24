import { Controller } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Get, Delete, Post, Body, Param } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CrearUsuarioAdminDto } from '../dto/crear-usuario-admin.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  obtenerPerfil(@Req() req: RequestWithUser) {
    return this.usersService.obtenerPerfilCompleto(req.user!.userId);
  }    

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Post()
  async crearUsuarioDesdeAdmin(@Body() dto: CrearUsuarioAdminDto) {
    return this.usersService.crearDesdeAdmin(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Delete(':id')
  async deshabilitarUsuario(@Param('id') id: string) {
    return this.usersService.bajaLogica(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Post('rehabilitar/:id')
  async rehabilitarUsuario(@Param('id') id: string) {
    return this.usersService.altaLogica(id);
  }

  


}
