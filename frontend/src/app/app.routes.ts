import { Routes } from '@angular/router';
import { Registro } from './pages/registro/registro';
import { Login } from './pages/login/login';
import { Publicaciones } from './pages/publicaciones/publicaciones';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';

export const routes: Routes = [
    { path: 'registro', component: Registro },
    { path: 'login', component: Login },
    { path: 'publicaciones', component: Publicaciones },
    { path: 'miperfil', component: MiPerfil },
    { path: '', redirectTo: 'publicaciones', pathMatch: 'full' },
    { path: '**', redirectTo: 'publicaciones' }
];
