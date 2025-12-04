import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signupmodal.html',
  styleUrl: './signupmodal.scss'
})
export class SignupModal {
  @Output() close = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();

  protected authService: AuthService;

  email: string = '';
  password: string = '';
  fullName: string = '';
  role: 'admin' | 'student' = 'student';
  error: string = '';
  loading: boolean = false;

  constructor() {
    this.authService = inject(AuthService);
  }

  onSignup(): void {
    if (!this.email || !this.password || !this.fullName) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.email, this.password, this.fullName, this.role).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.close.emit();
          window.location.reload(); // Reload to update header and navigation
        } else {
          this.error = 'Registration failed. Please try again.';
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

  onSwitchToLogin(): void {
    this.switchToLogin.emit();
  }
}

