import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PublicacionesService } from '../../services/publicaciones.service';
import { ComentariosService } from '../../services/comentarios.service';
import { Publicacion } from '../../componentes/publicacion/publicacion';
import { AuthService } from '../../services/auth.service';
import { PerfilService } from '../../services/perfil.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-publicacion-detalle',
  standalone: true,
  imports: [CommonModule, Publicacion, ReactiveFormsModule],
  templateUrl: './publicacion-detalle.html',
  styleUrls: ['./publicacion-detalle.css'] 
})
export class PublicacionDetalle implements OnInit {
  publicacion: any;
  comentarios: any[] = [];
  usuarioId: string | null = null;
  comentarioForm: FormGroup;
  perfil: any; 

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
    private fb: FormBuilder
  ) {
    this.comentarioForm = this.fb.group({
      mensaje: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  ngOnInit() {
    this.perfilService.getMiPerfil().subscribe({
      next: data => {
        this.usuarioId = data.user._id;
        this.perfil = data; 
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
        .subscribe((res) => {
          if (res.length < this.limit) this.hayMas = false;

          
          this.comentarios.push(...res);
          
          this.offset += this.limit;
          this.cargando = false;
        });
    }

  enviarComentario() {
    if (this.comentarioForm.invalid || !this.publicacionId) return;

    const mensaje = this.comentarioForm.value.mensaje;

    this.comentariosService.crearComentario(this.publicacionId, mensaje).subscribe({
      next: (nuevoComentario) => {

        const comentarioCompleto = {
          ...nuevoComentario,
          mensaje: mensaje,
          autor: {
            _id: this.usuarioId,
            username: this.perfil?.user.username || 'Anónimo',
            profileImageUrl: this.perfil?.user.profileImageUrl || ''
          }
        };

        this.comentarios.push(comentarioCompleto);
        this.comentarioForm.reset();
      },
      error: err => console.error('Error al enviar comentario:', err)
    });
  }

  recargarComentarios() {
    if (!this.publicacionId) return;

    this.comentariosService.listarComentarios(this.publicacionId, 0, this.offset + this.limit)
      .subscribe((res) => {
        this.comentarios = res;
      });
  }
}