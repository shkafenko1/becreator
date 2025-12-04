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
}

