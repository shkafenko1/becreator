import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentService } from '@services/student.service';

@Component({
  selector: 'profile-data',
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-data.html',
  styleUrl: './profile-data.scss',
})
export class ProfileData implements OnInit {
  protected studentService: StudentService;
  
  courseStructure: any = null;
  progress: any = null;
  loading = true;
  error: string = '';

  constructor() {
    this.studentService = inject(StudentService);
  }

  ngOnInit(): void {
    this.loadCourseStructure();
    this.loadProgress();
  }

  loadCourseStructure(): void {
    this.loading = true;
    this.studentService.getCourseStructure().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.courseStructure = response.data;
        } else {
          this.error = 'Failed to load course';
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error loading course. You may not be enrolled yet.';
        this.loading = false;
      }
    });
  }

  loadProgress(): void {
    this.studentService.getProgress().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.progress = response.data.progress;
        }
      },
      error: (err: any) => {
        console.error('Error loading progress:', err);
      }
    });
  }
}
