import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilService } from '../../services/perfil.service';
import { PerfilResponse } from '../../models/perfil-response.model';
import { Publicacion } from '../../componentes/publicacion/publicacion'; 

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, Publicacion], 
  templateUrl: './mi-perfil.html',
  styleUrls: ['./mi-perfil.css']
})
export class MiPerfil implements OnInit {
  perfil?: PerfilResponse;
  error?: string;
  usuarioId = 'usuario-demo'; 

  constructor(private perfilService: PerfilService) {}

  ngOnInit() {
    this.perfilService.getMiPerfil().subscribe({
      next: data => this.perfil = data,
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
}