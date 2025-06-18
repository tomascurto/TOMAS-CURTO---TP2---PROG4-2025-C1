import { Component } from '@angular/core';
import { PublicacionesService } from '../../services/publicaciones.service';
import { Input } from '@angular/core';

@Component({
  selector: 'app-publicacion',
  template: `
    <div class="publicacion">
      <img *ngIf="publicacion.imagenUrl" [src]="publicacion.imagenUrl" alt="Imagen">
      <p>{{ publicacion.contenido }}</p>
      <button (click)="toggleLike()">
        {{ dioLike ? 'Quitar Like' : 'Dar Like' }} ({{ publicacion.likes.length }})
      </button>
    </div>
  `
})
export class Publicacion {
  @Input() publicacion!: any;
  dioLike = false;

  constructor(private publicacionesService: PublicacionesService) {}

  toggleLike() {
    const id = this.publicacion._id;
    if (this.dioLike) {
      this.publicacionesService.unlike(id).subscribe(() => {
        this.dioLike = false;
        this.publicacion.likes.pop();
      });
    } else {
      this.publicacionesService.like(id).subscribe(() => {
        this.dioLike = true;
        this.publicacion.likes.push('usuario-demo');
      });
    }
  }
}