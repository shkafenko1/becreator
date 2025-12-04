import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { SiteSettingsService, SiteSettingsDto } from '@services/site-settings.service';
import { LoginModal } from '../modals/loginmodal/loginmodal';
import { SignupModal } from '../modals/signupmodal/signupmodal';

@Component({
  selector: 'header-app',
  templateUrl: 'header.html',
  styleUrl: 'header.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginModal, SignupModal]
})
export class Header implements OnInit, OnDestroy {
  protected authService: AuthService;
  
  showLoginModal = false;
  showSignupModal = false;

  siteTitle = 'BeCreator';

  private readonly openLoginListener = () => this.openLoginModal();
  private readonly openSignupListener = () => this.openSignupModal();
  private readonly settingsUpdateListener = (event: Event) => {
    const custom = event as CustomEvent<{ settings: SiteSettingsDto }>;
    this.applyTitleFromSettings(custom.detail?.settings);
  };

  private readonly siteSettingsService = inject(SiteSettingsService);

  constructor() {
    this.authService = inject(AuthService);
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('open-login-modal', this.openLoginListener as EventListener);
      window.addEventListener('open-signup-modal', this.openSignupListener as EventListener);
      window.addEventListener('site-settings-updated', this.settingsUpdateListener as EventListener);
    }

    if (this.authService.isAuthenticated()) {
      this.siteSettingsService.getMySettings().subscribe({
        next: (response) => {
          if (response.success && response.data.settings) {
            this.applyTitleFromSettings(response.data.settings);
          }
        },
        error: () => {
          // ignore
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('open-login-modal', this.openLoginListener as EventListener);
      window.removeEventListener('open-signup-modal', this.openSignupListener as EventListener);
      window.removeEventListener('site-settings-updated', this.settingsUpdateListener as EventListener);
    }
  }

  private applyTitleFromSettings(settings?: SiteSettingsDto | null): void {
    if (!settings || !settings.landing_title) {
      return;
    }
    this.siteTitle = settings.landing_title;
    if (typeof document !== 'undefined') {
      document.title = settings.landing_title;
    }
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