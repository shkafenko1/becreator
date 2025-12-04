import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface SiteSettingsDto {
  id: number;
  admin_id: number;
  primary_color: string | null;
  secondary_color: string | null;
  banner_image_url: string | null;
  landing_title: string | null;
  landing_subtitle: string | null;
  footer_text: string | null;
  contact_email: string | null;
}

export interface SiteSettingsResponse {
  success: boolean;
  data: {
    settings: SiteSettingsDto | null;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SiteSettingsService {
  constructor(private api: ApiService) {}

  getMySettings(): Observable<SiteSettingsResponse> {
    return this.api.get<SiteSettingsResponse>('/site/settings');
  }
}

