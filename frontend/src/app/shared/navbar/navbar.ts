import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PerfilService } from '../../services/perfil.service';
import { OnInit } from '@angular/core';

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
  constructor(private authService: AuthService, private router: Router, private perfilService: PerfilService) {}
  
  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.perfilService.getMiPerfil().subscribe({
        next: (perfil) => {
          this.username = perfil.user.username;
          this.avatar = perfil.user.profileImageUrl;
        },
        error: () => {
          this.username = null;
        }
      });
    }
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