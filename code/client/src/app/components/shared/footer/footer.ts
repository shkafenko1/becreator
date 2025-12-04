import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteSettingsService, SiteSettingsDto } from '@services/site-settings.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer implements OnInit, OnDestroy {
  text: string | null = null;
  email: string | null = null;

  private readonly siteSettingsService = inject(SiteSettingsService);
  private readonly settingsUpdateListener = (event: Event) => {
    const custom = event as CustomEvent<{ settings: SiteSettingsDto }>;
    this.applyFromSettings(custom.detail?.settings);
  };

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('site-settings-updated', this.settingsUpdateListener as EventListener);
    }

    // Load initial values (for students/admins)
    this.siteSettingsService.getMySettings().subscribe({
      next: (response) => {
        if (response.success && response.data.settings) {
          this.applyFromSettings(response.data.settings);
        }
      },
      error: () => {
        // silent fail – footer just stays minimal
      }
    });
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('site-settings-updated', this.settingsUpdateListener as EventListener);
    }
  }

  private applyFromSettings(settings?: SiteSettingsDto | null): void {
    if (!settings) {
      return;
    }
    this.text = settings.footer_text;
    this.email = settings.contact_email;
  }
}


