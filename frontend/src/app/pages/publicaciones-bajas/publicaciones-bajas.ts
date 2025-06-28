import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { PublicacionesService } from '../../services/publicaciones.service';
import { PerfilService } from '../../services/perfil.service';
import { Publicacion } from '../../componentes/publicacion/publicacion';
import { Publicaciones } from '../publicaciones/publicaciones';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-publicaciones-bajas',
  imports: [Publicacion, CommonModule,FormsModule],
  templateUrl: './publicaciones-bajas.html',
  styleUrl: './publicaciones-bajas.css'
})
export class PublicacionesBajas implements OnInit {
  publicaciones: any[] = [];
  perfil: any;
  offset = 0; limit = 10;
  cargando = false;
  hayMas = true;

  constructor(private pubService: PublicacionesService, private perfilService: PerfilService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    if (this.cargando || !this.hayMas) return;
    this.cargando = true;

    this.pubService.listarBajas(this.offset, this.limit).subscribe({
      next: (res: any[]) => {
        this.publicaciones.push(...res);
        this.offset += this.limit;
        if (res.length < this.limit) this.hayMas = false;
        this.cargando = false;
      }
    });
  }

  rehabilitar(id: string) {
    this.pubService.rehabilitar(id).subscribe(() => {
      this.publicaciones = this.publicaciones.filter(p => p._id !== id);
    });
  }
}
