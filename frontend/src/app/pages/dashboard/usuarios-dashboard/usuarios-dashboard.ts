import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Registro } from '../../registro/registro';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios-dashboard',
  imports: [CommonModule, FormsModule, Registro],
  templateUrl: './usuarios-dashboard.html',
  styleUrl: './usuarios-dashboard.css'
})
export class UsuariosDashboard implements OnInit {
  usuarios: any[] = [];
  abrirFormulario = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.adminService.getAllUsers().subscribe({
      next: (usuarios) => this.usuarios = usuarios,
      error: (err) => console.error('Error al cargar usuarios', err)
    });
  }

  bajaUsuario(id: string) {
    this.adminService.disableUser(id).subscribe(() => this.cargarUsuarios());
  }

  altaUsuario(id: string) {
    this.adminService.enableUser(id).subscribe(() => this.cargarUsuarios());
  }

  onCerrarFormulario() {
    this.abrirFormulario = false;
    this.cargarUsuarios();  
  }

  toggleRol(id: string) {
    this.adminService.cambiarRolUsuario(id).subscribe(() => this.cargarUsuarios());
  }

}
