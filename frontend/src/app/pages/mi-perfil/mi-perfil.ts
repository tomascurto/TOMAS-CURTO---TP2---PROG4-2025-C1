import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { PerfilResponse } from '../../models/perfil-response.model';


@Component({
  selector: 'app-mi-perfil',
  imports: [CommonModule],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css'
})
export class MiPerfil implements OnInit {
    perfil?: PerfilResponse;
    error?: string;

    constructor(private perfilService: PerfilService) {}

    ngOnInit() {
      this.perfilService.getMiPerfil().subscribe({
        next: data => this.perfil = data,
        error: err => this.error = err.error?.message || 'Error al cargar perfil'
      });
    }
}
