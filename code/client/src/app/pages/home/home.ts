import { CommonModule } from '@angular/common';
import { Component, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthPlate } from '../../components/ui/landing/authPlate/authPlate';
import { AuthService } from '../../services/auth.service';
import { SiteSettingsDto, SiteSettingsService } from '../../services/site-settings.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AuthPlate],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnDestroy {
  private settingsSubscription?: Subscription;

  private readonly auth = inject(AuthService);
  private readonly siteSettingsService = inject(SiteSettingsService);

  protected readonly user = this.auth.user;
  protected readonly isAuthenticated = computed(() => !!this.user());

  protected readonly siteSettings = signal<SiteSettingsDto | null>(null);
  protected readonly settingsError = signal('');

  // Computed values for the authenticated view
  protected readonly bannerUrl = computed(() => {
    const settings = this.siteSettings();
    return settings?.banner_image_url || '/banner.jpg';
  });

  constructor() {
    effect(
      () => {
        if (this.isAuthenticated()) {
          this.loadPersonalizedContent();
        } else {
          this.resetPersonalizedContent();
        }
      },
      { allowSignalWrites: true }
    );
  }

  private loadPersonalizedContent(): void {
    this.settingsError.set('');
    this.settingsSubscription?.unsubscribe();

    this.settingsSubscription = this.siteSettingsService.getMySettings().subscribe({
      next: (response) => {
        if (response.success) {
          const raw = response.data?.settings ?? null;

          if (!raw) {
            this.siteSettings.set(null);
            return;
          }

          // Apply sensible defaults so content and theming never feel empty
          const withDefaults: SiteSettingsDto = {
            ...raw,
            primary_color: raw.primary_color || '#007bff',
            secondary_color: raw.secondary_color || '#ffffff',
            banner_image_url: raw.banner_image_url || '/banner.jpg',
            landing_title: raw.landing_title || 'Welcome back!',
            landing_subtitle:
              raw.landing_subtitle ||
              'Continue your journey to level up your expertise on BeCreator.',
          };

          this.applyTheme(withDefaults);
          this.siteSettings.set(withDefaults);
        } else {
          this.siteSettings.set(null);
          this.settingsError.set('Unable to load your personalized content right now.');
        }
      },
      error: () => {
        this.siteSettings.set(null);
        this.settingsError.set('Unable to load your personalized content right now.');
      }
    });
  }

  private resetPersonalizedContent(): void {
    this.settingsSubscription?.unsubscribe();
    this.settingsSubscription = undefined;
    this.siteSettings.set(null);
    this.settingsError.set('');
  }

  /**
   * Apply primary/secondary colors from site settings to the global CSS variables
   * so that admin panel, buttons, and course views pick them up automatically.
   */
  private applyTheme(settings: SiteSettingsDto): void {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const primary = settings.primary_color || '#007bff';
    const secondary = settings.secondary_color || '#ffffff';

    root.style.setProperty('--primary', primary);
    root.style.setProperty('--secondary', secondary);

    // Provide a slightly darker shade for hover/focus states
    const primaryDark = this.darkenColor(primary, 0.2) || '#0056b3';
    root.style.setProperty('--primary-dark', primaryDark);

    if (settings.landing_title) {
      document.title = settings.landing_title;
    }
  }

  private darkenColor(hex: string, amount: number): string | null {
    if (!hex?.startsWith('#') || (hex.length !== 7 && hex.length !== 4)) {
      return null;
    }

    const full = hex.length === 4
      ? '#' +
        hex[1] + hex[1] +
        hex[2] + hex[2] +
        hex[3] + hex[3]
      : hex;

    const r = parseInt(full.substring(1, 3), 16);
    const g = parseInt(full.substring(3, 5), 16);
    const b = parseInt(full.substring(5, 7), 16);

    const factor = 1 - amount;
    const toHex = (v: number) =>
      Math.max(0, Math.min(255, Math.round(v * factor)))
        .toString(16)
        .padStart(2, '0');

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  ngOnDestroy(): void {
    this.settingsSubscription?.unsubscribe();
  }
}
