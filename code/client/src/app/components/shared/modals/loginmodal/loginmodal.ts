import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loginmodal.html',
  styleUrl: './loginmodal.scss'
})
export class LoginModal {
  @Output() close = new EventEmitter<void>();
  @Output() switchToSignup = new EventEmitter<void>();

  protected authService: AuthService;

  email: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  constructor() {
    this.authService = inject(AuthService);
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.close.emit();
          window.location.reload(); // Reload to update header and navigation
        } else {
          this.error = 'Login failed. Please check your credentials.';
          this.loading = false;
        }
      },
      error: (err: any) => {
        this.error = err.error?.message || 'An error occurred. Please try again.';
        this.loading = false;
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onSwitchToSignup(): void {
    this.switchToSignup.emit();
  }
}

