import { Routes } from '@angular/router';
import { Registro } from './pages/registro/registro';
import { Login } from './pages/login/login';
import { Publicaciones } from './pages/publicaciones/publicaciones';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';


export const routes: Routes = [
    { path: 'registro', component: Registro , canActivate: [NoAuthGuard] },
    { path: 'login', component: Login , canActivate: [NoAuthGuard] },
    { path: 'publicaciones', component: Publicaciones , canActivate: [AuthGuard]},
    { path: 'miperfil', component: MiPerfil , canActivate: [AuthGuard]},
    { path: '', redirectTo: 'publicaciones', pathMatch: 'full' },
    { path: '**', redirectTo: 'publicaciones' }
];
