import { Routes } from '@angular/router';
import { Registro } from './pages/registro/registro';
import { Login } from './pages/login/login';
import { Publicaciones } from './pages/publicaciones/publicaciones';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { Publicar } from './pages/publicar/publicar';
import { PublicacionDetalle } from './pages/publicacion-detalle/publicacion-detalle';
import { Loading } from './loading/loading';
import { AdminGuard } from './guards/admin.guard';
import { UsuariosDashboard } from './pages/dashboard/usuarios-dashboard/usuarios-dashboard';
import { PublicacionesBajas } from './pages/publicaciones-bajas/publicaciones-bajas';
import { DashboardEstadisticas } from './pages/dashboard-estadisticas/dashboard-estadisticas';

export const routes: Routes = [
    { path: 'registro', component: Registro , canActivate: [NoAuthGuard] },
    { path: 'login', component: Login , canActivate: [NoAuthGuard] },
    { path: 'publicaciones', component: Publicaciones , canActivate: [AuthGuard]},
    { path: 'publicaciones/:id', component: PublicacionDetalle, canActivate: [AuthGuard] },
    { path: 'miperfil', component: MiPerfil , canActivate: [AuthGuard]},
    { path: 'publicar', component: Publicar , canActivate: [AuthGuard]},
    { path: 'dashboard/usuarios', component: UsuariosDashboard, canActivate: [AdminGuard]},
    { path: 'publicaciones-bajas', component: PublicacionesBajas , canActivate: [AuthGuard]},
    { path: 'dashboard-estadisticas', component: DashboardEstadisticas, canActivate: [AdminGuard]},

    { path: '', component: Loading },
    { path: '**', redirectTo: '' }
];