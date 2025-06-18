import { Component } from '@angular/core';
import { PublicacionesService } from '../../services/publicaciones.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-publicaciones',
  imports: [FormsModule],
  templateUrl: './publicaciones.css', 
})
export class Publicaciones {
  publicaciones: any[] = [];
  orden: 'fecha' | 'likes' = 'fecha';
  offset = 0;
  limit = 5;

  constructor(private publicacionesService: PublicacionesService) {
    this.cargarPublicaciones();
  }

  cargarPublicaciones() {
    this.publicacionesService.listar(this.orden, this.offset, this.limit).subscribe(data => {
      this.publicaciones = data;
    });
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
}