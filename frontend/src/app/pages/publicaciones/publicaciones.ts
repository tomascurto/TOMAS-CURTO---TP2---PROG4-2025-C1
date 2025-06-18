import { Component } from '@angular/core';
import { PublicacionesService } from '../../services/publicaciones.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-publicaciones',
  imports: [FormsModule, CommonModule],
  templateUrl: './publicaciones.html',
  styleUrls: ['./publicaciones.css']
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
  this.publicacionesService.listar('fecha', 0, 10).subscribe((data) => {
    this.publicaciones = data.map((pub: any) => ({
      ...pub,
      yaLeGusta: pub.likes.includes(this.usuarioId),
    }));
  });
}
usuarioId = 'usuario-demo'; 
  toggleLike(pub: any) {
    const yaLeGusta = pub.likes?.includes(this.usuarioId);

    if (yaLeGusta) {
      this.publicacionesService.unlike(pub._id).subscribe(() => {
        pub.likes = pub.likes.filter((id: string) => id !== this.usuarioId);
      });
    } else {
      this.publicacionesService.like(pub._id).subscribe(() => {
        pub.likes.push(this.usuarioId);
      });
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
}