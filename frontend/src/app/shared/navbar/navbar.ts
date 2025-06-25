import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PerfilService } from '../../services/perfil.service';
import { OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar  implements OnInit{
  username: string | null = null;
  avatar: string | undefined = undefined;
  role: string = "";
  constructor(private authService: AuthService, private router: Router, private perfilService: PerfilService) {}
  
  ngOnInit(): void {
     this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isLoggedIn()) {
          this.perfilService.getMiPerfil().subscribe({
            next: (perfil) => {
              this.username = perfil.user.username;
              this.avatar = perfil.user.profileImageUrl;
              this.role = perfil.user.role;
            },
            error: () => {
              this.username = null;
              this.avatar = undefined;
              this.role = "";
            }
          });
        } else {
          this.username = null;
          this.avatar = undefined;
          this.role = "";
        }
      });
  }

  isAdmin(): boolean {
    if (this.role=="administrador"){
      return true
    }
    else {return false}
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.username = null;
    this.avatar = undefined;
  }
}