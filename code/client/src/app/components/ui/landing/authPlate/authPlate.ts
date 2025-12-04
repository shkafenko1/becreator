import { Component } from '@angular/core';

@Component({
  selector: 'auth-plate',
  templateUrl: 'authPlate.html',
  styleUrl: 'authPlate.scss',
  standalone: true
})
export class AuthPlate {
  login(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-login-modal'));
    }
  }

  signup(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-signup-modal'));
    }
  }
}