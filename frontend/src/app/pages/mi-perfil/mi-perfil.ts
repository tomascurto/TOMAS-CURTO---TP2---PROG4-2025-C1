import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilService } from '../../services/perfil.service';
import { PerfilResponse } from '../../models/perfil-response.model';
import { Publicacion } from '../../componentes/publicacion/publicacion'; 
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, Publicacion, RouterLink], 
  templateUrl: './mi-perfil.html',
  styleUrls: ['./mi-perfil.css']
})
export class MiPerfil implements OnInit {
  perfil?: PerfilResponse;
  error?: string;
  usuarioId = ''; 

  constructor(private perfilService: PerfilService, private router: Router) {}

  ngOnInit() {
    this.perfilService.getMiPerfil().subscribe({
      next: data => {
      this.perfil = data;
      this.usuarioId = data.user._id;
    },
      error: err => this.error = err.error?.message || 'Error al cargar perfil'
    });
  }

  onLikeChanged(pub: any) {
    if (!this.perfil) return;
    const idx = this.perfil.publicaciones.findIndex(p => p._id === pub._id);
    if (idx !== -1) {
      this.perfil.publicaciones[idx] = pub;
    }
  }

  irADetalle(publicacionId: string) {
    this.router.navigate(['/publicaciones', publicacionId]);
  }
  
}