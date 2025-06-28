import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { PublicacionesService } from '../../services/publicaciones.service';
import { PerfilService } from '../../services/perfil.service';
import { Publicacion } from '../../componentes/publicacion/publicacion';
import { Publicaciones } from '../publicaciones/publicaciones';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';
import { NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-publicaciones-bajas',
  imports: [Publicacion, CommonModule, FormsModule],
  templateUrl: './publicaciones-bajas.html',
  styleUrl: './publicaciones-bajas.css',
})
export class PublicacionesBajas implements OnInit {
  publicaciones: any[] = [];
  perfil: any;
  offset = 0;
  limit = 10;
  cargando = false;
  hayMas = true;
  username: string | null = null;
  avatar: string | undefined = undefined;
  role: string = '';

  usuarioId = 'usuario-demo';

  constructor(
    private pubService: PublicacionesService,
    private authService: AuthService,
    private router: Router,
    private perfilService: PerfilService
  ) {}

  ngOnInit() {
    this.perfilService.getMiPerfil().subscribe({
      next: (perfil) => {
        this.username = perfil.user.username;
        this.avatar = perfil.user.profileImageUrl;
        this.role = perfil.user.role;
        this.usuarioId = perfil.user._id;

        this.cargar();
      },
      error: () => {
        this.username = null;
        this.avatar = undefined;
        this.role = '';
      },
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {});
  }

  cargar() {
    if (this.cargando || !this.hayMas) return;
    this.cargando = true;

    const fetch$ = this.isAdmin()
      ? this.pubService.listarBajas(this.offset, this.limit)
      : this.pubService.listarBajasPropias(this.offset, this.limit);

    fetch$.subscribe({
      next: (res: any[]) => {
        this.publicaciones.push(...res);
        this.offset += this.limit;
        if (res.length < this.limit) this.hayMas = false;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      },
    });
  }

  isAdmin(): boolean {
    if (this.role == 'administrador') {
      return true;
    } else {
      return false;
    }
  }

  rehabilitar(id: string) {
    this.pubService.rehabilitar(id).subscribe(() => {
      this.publicaciones = this.publicaciones.filter((p) => p._id !== id);
    });
  }
}
