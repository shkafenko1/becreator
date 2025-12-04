import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-site-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './site-settings.html',
  styleUrl: './site-settings.scss'
})
export class SiteSettings implements OnInit {
  settings: any = null;
  loading = true;
  error: string = '';
  saving = false;

  constructor(protected adminService: AdminService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading = true;
    this.adminService.getSiteSettings().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.settings = response.data.settings;
          this.applyDefaults();
          this.applyThemePreview();
          this.broadcastSettingsUpdate();
        } else {
          this.error = 'Failed to load settings';
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error loading settings';
        this.loading = false;
      }
    });
  }

  saveSettings(): void {
    if (!this.settings) {
      return;
    }
    this.saving = true;
    this.adminService.updateSiteSettings(this.settings).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.settings = response.data.settings;
          this.applyDefaults();
          this.applyThemePreview();
          this.broadcastSettingsUpdate();
        } else {
          this.error = 'Failed to save settings';
        }
        this.saving = false;
      },
      error: () => {
        this.error = 'Error saving settings';
        this.saving = false;
      }
    });
  }

  /**
   * Ensure the form never looks empty by providing defaults
   * that mirror the unauthenticated landing appearance.
   */
  private applyDefaults(): void {
    if (!this.settings) {
      return;
    }

    this.settings = {
      primary_color: this.settings.primary_color || '#007bff',
      secondary_color: this.settings.secondary_color || '#ffffff',
      logo_url: this.settings.logo_url || '',
      favicon_url: this.settings.favicon_url || '',
      banner_image_url: this.settings.banner_image_url || '/banner.jpg',
      landing_title:
        this.settings.landing_title || 'Your professionalism is our goal!',
      landing_subtitle:
        this.settings.landing_subtitle ||
        'Start with BeCreator - a white-label platform for your business',
      footer_text: this.settings.footer_text || '',
      contact_email: this.settings.contact_email || '',
      // Preserve ids if present
      id: this.settings.id,
      admin_id: this.settings.admin_id
    };
  }

  /**
   * Apply primary/secondary colors and title from the form
   * so the admin immediately sees the effect of their changes.
   */
  private applyThemePreview(): void {
    if (typeof document === 'undefined' || !this.settings) {
      return;
    }

    const root = document.documentElement;
    const primary = this.settings.primary_color || '#007bff';
    const secondary = this.settings.secondary_color || '#ffffff';

    root.style.setProperty('--primary', primary);
    root.style.setProperty('--secondary', secondary);

    const primaryDark = this.darkenColor(primary, 0.2) || '#0056b3';
    root.style.setProperty('--primary-dark', primaryDark);

    if (this.settings.landing_title) {
      document.title = this.settings.landing_title;
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

  private broadcastSettingsUpdate(): void {
    if (typeof window === 'undefined' || !this.settings) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent('site-settings-updated', { detail: { settings: this.settings } })
    );
  }
}

