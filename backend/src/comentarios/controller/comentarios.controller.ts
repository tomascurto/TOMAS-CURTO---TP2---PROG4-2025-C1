import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ComentariosService } from '../service/comentarios.service';
import { CrearComentarioDto } from '../dto/crear-comentario.dto';
import { EditarComentarioDto } from '../dto/editar-comentario.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

interface RequestConUsuario extends Request {
  user?: { userId: string };
}

@UseGuards(JwtAuthGuard)
@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post(':publicacionId')
  async crear(
    @Param('publicacionId') publicacionId: string,
    @Req() req: RequestConUsuario,
    @Body() dto: CrearComentarioDto,
  ) {
    const autorId = req.user!.userId;
    const comentario = await this.comentariosService.crear(publicacionId, autorId, dto);
    return { message: 'Comentario agregado', comentario };
  }

  @Put(':comentarioId')
  async editar(@Param('comentarioId') comentarioId: string, @Body() dto: EditarComentarioDto) {
    const comentario = await this.comentariosService.editar(comentarioId, dto);
    return { message: 'Comentario modificado', comentario };
  }

  @Get(':publicacionId')
  async listar(
    @Param('publicacionId') publicacionId: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
  ) {
    const comentarios = await this.comentariosService.listar(publicacionId, Number(offset), Number(limit));
    return comentarios;
  }
}
