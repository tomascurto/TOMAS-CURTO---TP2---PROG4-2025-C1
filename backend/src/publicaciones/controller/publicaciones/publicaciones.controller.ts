import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  Get,
  Delete,
  Param,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicacionesService } from '../../../publicaciones/service/publicaciones/publicaciones.service';
import { CrearPublicacionDto } from '../../../publicaciones/dto/crear-publicacion.dto/crear-publicacion.dto';
import { UserPayload } from 'src/auth/interfaces/user-payload.interface';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { UserRole } from '../../../users/schemas/user.schema';
import { CloudinaryService } from '../../../cloudinary/cloudinary.service';
import { Roles } from '../../../auth/roles.decorator';

interface RequestConUsuario extends Request {
  user?: {
    userId: string;
    role?: string;
    username: string
  };
}

@UseGuards(JwtAuthGuard)
@Controller('publicaciones')
export class PublicacionesController {
  constructor(
    private readonly publicacionesService: PublicacionesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('subir-imagen')
  @UseInterceptors(FileInterceptor('imagen'))
  async subirImagen(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadImage(
      file,
      'publicaciones',
    );
    return { url: result };
  }

  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  async crear(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CrearPublicacionDto,
    @Req() req: RequestConUsuario,
  ) {
    console.log('Usuario en request:', req.user);
    const usuarioId = req.user!.userId;
    const publicacion = await this.publicacionesService.crearPublicacion(
      dto,
      usuarioId,
      file,
    );
    return { message: 'Publicación creada', publicacion };
  }

  @Delete(':id')
  async bajaLogica(@Param('id') id: string, @Req() req: RequestConUsuario) {
    const usuarioId = req.user!.userId;
    const esAdmin = req.user?.role === UserRole.ADMIN;
    await this.publicacionesService.bajaLogica(id, usuarioId, esAdmin);
    return { message: 'Publicación dada de baja lógicamente' };
  }

  @Post(':id/rehabilitar')
  async altaLogica(@Param('id') id: string, @Req() req: RequestConUsuario) {
    const usuarioId = req.user!.userId;
    const esAdmin = req.user!.role === UserRole.ADMIN;
    
    await this.publicacionesService.altaLogica(id, usuarioId, esAdmin);
    return { message: 'Publicación reactivada correctamente' };
  }

  @Get()
  async listar(
    @Query('orden') orden: 'fecha' | 'likes' = 'fecha',
    @Query('usuarioId') usuarioId?: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
  ) {
    const publicaciones = await this.publicacionesService.listarPublicaciones(
      orden,
      usuarioId,
      Number(offset),
      Number(limit),
    );
    return publicaciones;
  }

  @Post(':id/like')
  async like(@Param('id') id: string, @Req() req: RequestConUsuario) {
    const usuarioId = req.user!.userId;
    const publicacion = await this.publicacionesService.darLike(id, usuarioId);
    return { message: 'Like agregado', publicacion };
  }

  @Delete(':id/like')
  async unlike(@Param('id') id: string, @Req() req: RequestConUsuario) {
    const usuarioId = req.user!.userId;
    const publicacion = await this.publicacionesService.quitarLike(
      id,
      usuarioId,
    );
    return { message: 'Like removido', publicacion };
  }

  
  @Put(':id')
  async editarPublicacion(
    @Param('id') id: string,
    @Body() dto: CrearPublicacionDto,
    @Req() req: RequestConUsuario,
  ) {
    const usuarioId = req.user!.userId;
    const actualizada = await this.publicacionesService.editarPublicacion(
      id,
      dto,
      usuarioId,
    );
    return { message: 'Publicación actualizada', publicacion: actualizada };
  }
  
  @Get('bajas')
  async listarBajas(
    @Req() req: RequestConUsuario,
    @Query('offset') offset = '0',
    @Query('limit') limit = '10',
  ) {
    
  console.log('req.user:', req.user); 
    
  const esAdmin = req.user!.role === UserRole.ADMIN;
  const usuarioId = esAdmin ? null : req.user!.userId;
    const bajas = await this.publicacionesService.listarPorEstado(
      false,
      esAdmin,
      +offset,
      +limit,
    );
    return bajas;
  }
  
  @Get('bajas/mias')
  async obtenerMisPublicacionesBajas(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req: RequestConUsuario
  ) {
    
  console.log('req.user:', req.user);
  console.log('Offset:', offset);
  console.log('Limit:', limit);
  const usuario = req.user as any;
  console.log('Usuario autenticado:', usuario.userId);
    return this.publicacionesService.listarPorEstado(
      false,
      false, 
      offset,
      limit
    );
  }
  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const pub = await this.publicacionesService.obtenerPorId(id);
    return { publicacion: pub };
  }
}
