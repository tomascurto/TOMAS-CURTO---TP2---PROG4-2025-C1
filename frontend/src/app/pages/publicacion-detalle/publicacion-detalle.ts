import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PublicacionesService } from '../../services/publicaciones.service';
import { ComentariosService } from '../../services/comentarios.service';
import { Publicacion } from '../../componentes/publicacion/publicacion';
import { AuthService } from '../../services/auth.service';
import { PerfilService } from '../../services/perfil.service';

@Component({
  selector: 'app-publicacion-detalle',
  standalone: true,
  imports: [CommonModule, Publicacion],
  templateUrl: './publicacion-detalle.html',
  styleUrls: ['./publicacion-detalle.css'] // ✅ CORREGIDO
})
export class PublicacionDetalle implements OnInit {
  publicacion: any;
  comentarios: any[] = [];
  usuarioId: string | null = null;

  private publicacionId: string = '';
  offset: number = 0;
  limit: number = 5;
  cargando: boolean = false;
  hayMas: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private publicacionesService: PublicacionesService,
    private comentariosService: ComentariosService,
    private authService: AuthService,
    private perfilService: PerfilService,
  ) {}

  ngOnInit() {
    this.perfilService.getMiPerfil().subscribe({
      next: data => {
        this.usuarioId = data.user._id;
      }
    });

    this.publicacionId = this.route.snapshot.paramMap.get('id') || '';

    this.publicacionesService.obtenerPorId(this.publicacionId).subscribe({
      next: (res) => {
        this.publicacion = res.publicacion;
      },
      error: (err) => {
        console.error('Error al obtener publicación:', err);
      }
    });

    this.cargarComentarios();
  }

  cargarComentarios() {
    if (this.cargando || !this.hayMas) return;
    this.cargando = true;

    this.comentariosService
      .listarComentarios(this.publicacionId, this.offset, this.limit)
      .subscribe({
        next: (res) => {
          if (res.length < this.limit) this.hayMas = false;
          this.comentarios.push(...res);
          this.offset += this.limit;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar comentarios:', err);
          this.cargando = false;
        }
      });
  }
}