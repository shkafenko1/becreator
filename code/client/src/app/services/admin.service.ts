import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Course {
  id: number;
  admin_id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  description: string;
  video_url: string;
  content: string;
  order_index: number;
  created_at: string;
  updated_at: string;
  files?: any[];
}

export interface SiteSettings {
  id: number;
  admin_id: number;
  primary_color: string;
  secondary_color: string;
  logo_url: string;
  favicon_url: string;
  banner_image_url: string;
  landing_title: string;
  landing_subtitle: string;
  footer_text: string;
  contact_email: string;
}

export interface Student {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
  completed_lessons: number;
  total_lessons: number;
  progress: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private api: ApiService) {}

  // Course
  getCourse(): Observable<any> {
    return this.api.get('/admin/course');
  }

  updateCourse(data: { title: string; description: string }): Observable<any> {
    return this.api.put('/admin/course', data);
  }

  // Modules
  getModules(): Observable<any> {
    return this.api.get('/admin/modules');
  }

  createModule(data: { title: string; description?: string }): Observable<any> {
    return this.api.post('/admin/modules', data);
  }

  updateModule(id: number, data: { title?: string; description?: string; orderIndex?: number }): Observable<any> {
    return this.api.put(`/admin/modules/${id}`, data);
  }

  deleteModule(id: number): Observable<any> {
    return this.api.delete(`/admin/modules/${id}`);
  }

  // Lessons
  getLessons(moduleId: number): Observable<any> {
    return this.api.get(`/admin/modules/${moduleId}/lessons`);
  }

  createLesson(moduleId: number, data: { title: string; description?: string; videoUrl?: string; content?: string }): Observable<any> {
    return this.api.post(`/admin/modules/${moduleId}/lessons`, data);
  }

  updateLesson(id: number, data: { title?: string; description?: string; videoUrl?: string; content?: string; orderIndex?: number }): Observable<any> {
    return this.api.put(`/admin/lessons/${id}`, data);
  }

  deleteLesson(id: number): Observable<any> {
    return this.api.delete(`/admin/lessons/${id}`);
  }

  // Site Settings
  getSiteSettings(): Observable<any> {
    return this.api.get('/admin/site-settings');
  }

  updateSiteSettings(settings: Partial<SiteSettings>): Observable<any> {
    return this.api.put('/admin/site-settings', settings);
  }

  // Students
  getStudents(): Observable<any> {
    return this.api.get('/admin/students');
  }

  enrollStudent(data: { email: string; fullName: string }): Observable<any> {
    return this.api.post('/admin/students/enroll', data);
  }
}



