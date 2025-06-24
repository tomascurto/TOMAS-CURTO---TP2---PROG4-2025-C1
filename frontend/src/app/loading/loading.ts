import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.css'
})
export class Loading implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.autorizar().subscribe({
      next: (res) => {
        this.router.navigate(['/publicaciones']);
      },
      error: (err) => {
        console.error('Token inválido o expirado', err);
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }
}
