import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { PublicacionesService } from '../../services/publicaciones.service';
import { ComentariosService } from '../../services/comentarios.service';
import { Publicacion } from '../../componentes/publicacion/publicacion';
import { AuthService } from '../../services/auth.service';
import { PerfilService } from '../../services/perfil.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormSubmittedEvent,
  FormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-publicacion-detalle',
  standalone: true,
  imports: [CommonModule, Publicacion, ReactiveFormsModule, FormsModule],
  templateUrl: './publicacion-detalle.html',
  styleUrls: ['./publicacion-detalle.css'],
})
export class PublicacionDetalle implements OnInit {
  publicacion: any;
  comentarios: any[] = [];
  usuarioId: string | null = null;
  comentarioForm: FormGroup;
  perfil: any;
  editarForm: boolean = false;
  formEdicion: FormGroup;
  username: string | null = null;
  avatar: string | undefined = undefined;
  role: string = "";

  private publicacionId: string = '';
  offset: number = 0;
  limit: number = 5;
  cargando: boolean = false;
  hayMas: boolean = true;
  editarModo: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private publicacionesService: PublicacionesService,
    private comentariosService: ComentariosService,
    private authService: AuthService,
    private router: Router,
    private perfilService: PerfilService,
    private fb: FormBuilder,
  ) {
    this.comentarioForm = this.fb.group({
      mensaje: ['', [Validators.required, Validators.maxLength(500)]],
    });
    this.formEdicion = this.fb.group({
      titulo: ['', Validators.required],
      mensaje: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.perfilService.getMiPerfil().subscribe({
      next: (data) => {
        this.usuarioId = data.user._id;
        this.perfil = data;
      },
    });
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
          this.perfilService.getMiPerfil().subscribe({
            next: (perfil) => {
              this.username = perfil.user.username;
              this.avatar = perfil.user.profileImageUrl;
              this.role = perfil.user.role;
            },
            error: () => {
              this.username = null;
              this.avatar = undefined;
              this.role = "";
            }
          });
      });

    this.publicacionId = this.route.snapshot.paramMap.get('id') || '';

    this.publicacionesService.obtenerPorId(this.publicacionId).subscribe({
      next: (res) => {
        this.publicacion = res.publicacion;
      },
      error: (err) => {
        console.error('Error al obtener publicación:', err);
      },
    });

    this.cargarComentarios();
  }

  isAdmin(): boolean {
    if (this.role=="administrador"){
      return true
    }
    else {return false}
  }

  guardarEdicion() {
    if (this.formEdicion.invalid || !this.publicacionId) return;

    this.publicacionesService
      .editarPublicacion(this.publicacionId, this.formEdicion.value)
      .subscribe({
        next: (res: any) => {
          this.publicacion = res.publicacion;
          this.editarModo = false;
        },
        error: (err: any) => console.error('Error al editar publicación:', err),
      });
  }

  activarEdicion() {
    this.editarForm = true;
    this.formEdicion.patchValue({
      titulo: this.publicacion.titulo,
      mensaje: this.publicacion.mensaje,
    });
  }

  borrarPublicacion() {
    if (!this.publicacionId) return;

    this.publicacionesService.bajaLogica(this.publicacionId).subscribe({
      next: () => {},
      error: (err: any) => console.error('Error al borrar:', err),
    });
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

    this.comentariosService
      .crearComentario(this.publicacionId, mensaje)
      .subscribe({
        next: (nuevoComentario) => {
          const comentarioCompleto = {
            ...nuevoComentario,
            mensaje: mensaje,
            autor: {
              _id: this.usuarioId,
              username: this.perfil?.user.username || 'Anónimo',
              profileImageUrl: this.perfil?.user.profileImageUrl || '',
            },
          };

          this.comentarios.push(comentarioCompleto);
          this.comentarioForm.reset();
        },
        error: (err) => console.error('Error al enviar comentario:', err),
      });
  }

  recargarComentarios() {
    if (!this.publicacionId) return;

    this.comentariosService
      .listarComentarios(this.publicacionId, 0, this.offset + this.limit)
      .subscribe((res) => {
        this.comentarios = res;
      });
  }

  toggleEstadoPublicacion() {
    if (!this.publicacion) return;

    const esActiva = this.publicacion.activo;
    const id = this.publicacion._id;

    const accion = esActiva
      ? this.publicacionesService.bajaLogica(id)
      : this.publicacionesService.rehabilitar(id);

    accion.subscribe({
      next: () => {
        this.publicacion.activo = !esActiva;
      },
      error: (err) => {
        console.error('Error al cambiar estado de publicación:', err);
      },
    });
  }

  puedeModificar(): boolean {
    if (!this.perfil || !this.publicacion) return false;

    const esAutor = this.perfil.user._id === this.publicacion.autor._id;
    const esAdmin = this.isAdmin();
    return esAutor || esAdmin;
  }
}
