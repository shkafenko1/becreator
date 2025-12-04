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
}

