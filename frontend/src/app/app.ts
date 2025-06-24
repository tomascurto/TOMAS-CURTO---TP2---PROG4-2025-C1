import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from './services/session.service';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionWarning } from './componentes/session-warning/session-warning';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, CommonModule, SessionWarning],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'frontend';
  showNavbar = false;
  showWarning = false;
  private sub?: Subscription;

  constructor(private router: Router, private sessionService: SessionService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showNavbar = event.url !== '/';
      });
  }

  ngOnInit() {
    this.sub = this.sessionService.showWarning$.subscribe(show => {
      this.showWarning = show;

      if (show) {
        this.sessionService.startLogoutTimer();
      }
    });
  }

  onExtend() {
    this.sessionService.extendSession();
  }

  onLogout() {
    this.sessionService.logout();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

}
