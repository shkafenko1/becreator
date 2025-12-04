import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './course-management.html',
  styleUrl: './course-management.scss'
})
export class CourseManagement implements OnInit {
  course: any = null;
  modules: any[] = [];
  loading = true;
  error: string = '';

  // Forms
  editingCourse = false;
  courseTitle: string = '';
  courseDescription: string = '';

  newModuleTitle: string = '';
  newModuleDescription: string = '';

  expandedModuleId: number | null = null;
  lessonsByModule: { [moduleId: number]: any[] } = {};

  newLessonTitle: string = '';
  newLessonDescription: string = '';
  newLessonVideoUrl: string = '';
  newLessonContent: string = '';

  editingModuleId: number | null = null;
  editingModuleTitle: string = '';
  editingModuleDescription: string = '';

  editingLessonId: number | null = null;
  editingLessonTitle: string = '';
  editingLessonDescription: string = '';
  editingLessonVideoUrl: string = '';
  editingLessonContent: string = '';

  constructor(protected adminService: AdminService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.adminService.getCourse().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.course = response.data.course;
          this.courseTitle = this.course?.title || '';
          this.courseDescription = this.course?.description || '';
          this.loadModules();
        } else {
          this.error = 'Failed to load course';
          this.loading = false;
        }
      },
      error: (err: any) => {
        this.error = 'Error loading course';
        this.loading = false;
      }
    });
  }

  loadModules(): void {
    this.adminService.getModules().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.modules = response.data.modules;
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error loading modules';
        this.loading = false;
      }
    });
  }

  saveCourse(): void {
    this.adminService.updateCourse({
      title: this.courseTitle,
      description: this.courseDescription
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.course = response.data.course;
          this.editingCourse = false;
        } else {
          this.error = 'Failed to save course';
        }
      },
      error: () => {
        this.error = 'Error saving course';
      }
    });
  }

  createModule(): void {
    if (!this.newModuleTitle.trim()) {
      return;
    }
    this.adminService.createModule({
      title: this.newModuleTitle,
      description: this.newModuleDescription
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.modules.push(response.data.module);
          this.newModuleTitle = '';
          this.newModuleDescription = '';
        } else {
          this.error = 'Failed to create module';
        }
      },
      error: () => {
        this.error = 'Error creating module';
      }
    });
  }

  startEditModule(module: any): void {
    this.editingModuleId = module.id;
    this.editingModuleTitle = module.title;
    this.editingModuleDescription = module.description;
  }

  cancelEditModule(): void {
    this.editingModuleId = null;
    this.editingModuleTitle = '';
    this.editingModuleDescription = '';
  }

  saveModule(moduleId: number): void {
    this.adminService.updateModule(moduleId, {
      title: this.editingModuleTitle,
      description: this.editingModuleDescription
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          const idx = this.modules.findIndex(m => m.id === moduleId);
          if (idx !== -1) {
            this.modules[idx] = response.data.module;
          }
          this.cancelEditModule();
        } else {
          this.error = 'Failed to update module';
        }
      },
      error: () => {
        this.error = 'Error updating module';
      }
    });
  }

  deleteModule(moduleId: number): void {
    if (!confirm('Delete this module and all its lessons?')) {
      return;
    }
    this.adminService.deleteModule(moduleId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.modules = this.modules.filter(m => m.id !== moduleId);
          delete this.lessonsByModule[moduleId];
        } else {
          this.error = 'Failed to delete module';
        }
      },
      error: () => {
        this.error = 'Error deleting module';
      }
    });
  }

  toggleModule(moduleId: number): void {
    if (this.expandedModuleId === moduleId) {
      this.expandedModuleId = null;
      return;
    }
    this.expandedModuleId = moduleId;
    if (!this.lessonsByModule[moduleId]) {
      this.loadLessons(moduleId);
    }
  }

  loadLessons(moduleId: number): void {
    this.adminService.getLessons(moduleId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.lessonsByModule[moduleId] = response.data.lessons;
        }
      }
    });
  }

  createLesson(moduleId: number): void {
    if (!this.newLessonTitle.trim()) {
      return;
    }
    this.adminService.createLesson(moduleId, {
      title: this.newLessonTitle,
      description: this.newLessonDescription,
      videoUrl: this.newLessonVideoUrl,
      content: this.newLessonContent
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          if (!this.lessonsByModule[moduleId]) {
            this.lessonsByModule[moduleId] = [];
          }
          this.lessonsByModule[moduleId].push(response.data.lesson);
          this.newLessonTitle = '';
          this.newLessonDescription = '';
          this.newLessonVideoUrl = '';
          this.newLessonContent = '';
        } else {
          this.error = 'Failed to create lesson';
        }
      },
      error: () => {
        this.error = 'Error creating lesson';
      }
    });
  }

  startEditLesson(lesson: any): void {
    this.editingLessonId = lesson.id;
    this.editingLessonTitle = lesson.title;
    this.editingLessonDescription = lesson.description;
    this.editingLessonVideoUrl = lesson.video_url;
    this.editingLessonContent = lesson.content;
  }

  cancelEditLesson(): void {
    this.editingLessonId = null;
    this.editingLessonTitle = '';
    this.editingLessonDescription = '';
    this.editingLessonVideoUrl = '';
    this.editingLessonContent = '';
  }

  saveLesson(moduleId: number, lessonId: number): void {
    this.adminService.updateLesson(lessonId, {
      title: this.editingLessonTitle,
      description: this.editingLessonDescription,
      videoUrl: this.editingLessonVideoUrl,
      content: this.editingLessonContent
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          const lessons = this.lessonsByModule[moduleId] || [];
          const idx = lessons.findIndex(l => l.id === lessonId);
          if (idx !== -1) {
            lessons[idx] = response.data.lesson;
          }
          this.cancelEditLesson();
        } else {
          this.error = 'Failed to update lesson';
        }
      },
      error: () => {
        this.error = 'Error updating lesson';
      }
    });
  }

  deleteLesson(moduleId: number, lessonId: number): void {
    if (!confirm('Delete this lesson?')) {
      return;
    }
    this.adminService.deleteLesson(lessonId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.lessonsByModule[moduleId] =
            (this.lessonsByModule[moduleId] || []).filter(l => l.id !== lessonId);
        } else {
          this.error = 'Failed to delete lesson';
        }
      },
      error: () => {
        this.error = 'Error deleting lesson';
      }
    });
  }
}

