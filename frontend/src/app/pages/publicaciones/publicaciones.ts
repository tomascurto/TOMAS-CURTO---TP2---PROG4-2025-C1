import { Component } from '@angular/core';
import { PublicacionesService } from '../../services/publicaciones.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Publicacion } from '../../componentes/publicacion/publicacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publicaciones',
  imports: [FormsModule, CommonModule, Publicacion],
  templateUrl: './publicaciones.html',
  styleUrls: ['./publicaciones.css'],
  standalone: true
})
export class Publicaciones {
  publicaciones: any[] = [];
  orden: 'fecha' | 'likes' = 'fecha';
  offset = 0;
  limit = 5;
  usuarioId = 'usuario-demo';

  constructor(private publicacionesService: PublicacionesService, private router: Router) {
    this.cargarPublicaciones();
  }

  cargarPublicaciones() {
    this.publicacionesService.listar(this.orden, this.offset, this.limit).subscribe((data) => {
      this.publicaciones = data.map((pub: any) => ({
        ...pub,
        yaLeGusta: pub.likes.includes(this.usuarioId),
      }));
    });
  }

  onLikeChanged(updatedPub: any) {
    const index = this.publicaciones.findIndex(p => p._id === updatedPub._id);
    if (index !== -1) {
      this.publicaciones[index] = updatedPub;
    }
  }

  paginaAnterior() {
    if (this.offset > 0) {
      this.offset -= this.limit;
      this.cargarPublicaciones();
    }
  }

  paginaSiguiente() {
    this.offset += this.limit;
    this.cargarPublicaciones();
  }

  irADetalle(publicacionId: string) {
    this.router.navigate(['/publicaciones', publicacionId]);
  }
  
}