import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PublicacionesService } from '../../services/publicaciones.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.html',
  styleUrls: ['./publicacion.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Publicacion {
  @Input() publicacion!: any;
  @Input() usuarioId!: string;
  @Output() likeChanged = new EventEmitter<any>();

  constructor(private publicacionesService: PublicacionesService) {}

  toggleLike() {
    const leGusta = this.publicacion.likes.includes(this.usuarioId);

    if (leGusta) {
      this.publicacionesService.unlike(this.publicacion._id).subscribe(() => {
        this.publicacion.likes = this.publicacion.likes.filter((id: string) => id !== this.usuarioId);
        this.likeChanged.emit(this.publicacion);
      });
    } else {
      this.publicacionesService.like(this.publicacion._id).subscribe(() => {
        this.publicacion.likes.push(this.usuarioId);
        this.likeChanged.emit(this.publicacion);
      });
    }
  }
}