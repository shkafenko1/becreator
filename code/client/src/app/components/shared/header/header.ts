import { Component, inject } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { LoginModal } from '../modals/loginmodal/loginmodal';
import { SignupModal } from '../modals/signupmodal/signupmodal';

@Component({
    selector: 'header-app',
    templateUrl: 'header.html',
    styleUrl: 'header.scss',
    standalone: true,
    imports: [CommonModule, RouterModule, LoginModal, SignupModal]
})

export class Header {
  protected authService: AuthService;
  
  showLoginModal = false;
  showSignupModal = false;

  constructor() {
    this.authService = inject(AuthService);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isStudent(): boolean {
    return this.authService.isStudent();
  }

  openLoginModal(): void {
    this.showLoginModal = true;
    this.showSignupModal = false;
  }

  openSignupModal(): void {
    this.showSignupModal = true;
    this.showLoginModal = false;
  }

  closeModals(): void {
    this.showLoginModal = false;
    this.showSignupModal = false;
  }

  switchToSignup(): void {
    this.showLoginModal = false;
    this.showSignupModal = true;
  }

  switchToLogin(): void {
    this.showSignupModal = false;
    this.showLoginModal = true;
  }

  logout(): void {
    this.authService.logout();
  }
}