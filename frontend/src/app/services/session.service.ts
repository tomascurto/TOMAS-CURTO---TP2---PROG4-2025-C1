import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private timer10MinSub?: Subscription;
  private timer5MinSub?: Subscription;
  
  private _showWarning = new BehaviorSubject<boolean>(false);
  showWarning$ = this._showWarning.asObservable();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  startSessionTimer() {
    this.clearTimers();
    this._showWarning.next(false);

    this.timer10MinSub = timer(10 * 60 * 1000).subscribe(() => {
      this._showWarning.next(true);
    });
  }

  extendSession() {
    this.authService.refrescarToken().subscribe({
      next: res => {
        localStorage.setItem('token', res.token);
        this._showWarning.next(false);
        this.startSessionTimer();
      },
      error: () => this.logout(),
    });
  }

  startLogoutTimer() {
    this.timer5MinSub = timer(5 * 60 * 1000).subscribe(() => {
      this.logout();
    });
  }

  logout() {
    this.clearTimers();
    this._showWarning.next(false);
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  clearTimers() {
    this.timer10MinSub?.unsubscribe();
    this.timer5MinSub?.unsubscribe();
  }
}