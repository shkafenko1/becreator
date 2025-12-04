import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface CourseStructure {
  course: {
    id: number;
    title: string;
    description: string;
  };
  structure: Array<{
    id: number;
    course_id: number;
    title: string;
    description: string;
    order_index: number;
    lessons: Array<{
      id: number;
      module_id: number;
      title: string;
      description: string;
      video_url: string;
      content: string;
      order_index: number;
      is_completed: boolean;
    }>;
  }>;
}

export interface LessonDetails {
  id: number;
  module_id: number;
  title: string;
  description: string;
  video_url: string;
  content: string;
  order_index: number;
  files: Array<{
    id: number;
    lesson_id: number;
    file_name: string;
    file_url: string;
    file_size: number;
  }>;
}

export interface Progress {
  total: number;
  completed: number;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private api: ApiService) {}

  getCourseStructure(): Observable<{ success: boolean; data: CourseStructure }> {
    return this.api.get('/student/course');
  }

  getLesson(lessonId: number): Observable<{ success: boolean; data: { lesson: LessonDetails } }> {
    return this.api.get(`/student/lessons/${lessonId}`);
  }

  markLessonComplete(lessonId: number): Observable<{ success: boolean; data: { progress: Progress } }> {
    return this.api.post(`/student/lessons/${lessonId}/complete`, {});
  }

  markLessonIncomplete(lessonId: number): Observable<{ success: boolean; data: { progress: Progress } }> {
    return this.api.post(`/student/lessons/${lessonId}/incomplete`, {});
  }

  getProgress(): Observable<{ success: boolean; data: { progress: Progress } }> {
    return this.api.get('/student/progress');
  }
}


