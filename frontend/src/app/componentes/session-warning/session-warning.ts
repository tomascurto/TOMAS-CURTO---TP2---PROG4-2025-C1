import { Component } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-session-warning',
  imports: [],
  templateUrl: './session-warning.html',
  styleUrl: './session-warning.css'
})
export class SessionWarning {
  @Output() extendSession = new EventEmitter<void>();
  @Output() logoutSession = new EventEmitter<void>();

  extend() {
    this.extendSession.emit();
  }

  logout() {
    this.logoutSession.emit();
  }
}
