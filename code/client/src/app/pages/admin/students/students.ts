import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './students.html',
  styleUrl: './students.scss'
})
export class Students implements OnInit {
  students: any[] = [];
  loading = true;
  error: string = '';

  // Enroll form
  newStudentEmail: string = '';
  newStudentName: string = '';
  enrolling = false;

  constructor(protected adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.adminService.getStudents().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.students = response.data.students;
        } else {
          this.error = 'Failed to load students';
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error loading students';
        this.loading = false;
      }
    });
  }

  enrollStudent(): void {
    if (!this.newStudentEmail.trim() || !this.newStudentName.trim()) {
      return;
    }

    this.enrolling = true;
    this.adminService.enrollStudent({
      email: this.newStudentEmail,
      fullName: this.newStudentName
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Reload students to reflect new enrollment
          this.loadStudents();
          this.newStudentEmail = '';
          this.newStudentName = '';
        } else {
          this.error = 'Failed to enroll student';
        }
        this.enrolling = false;
      },
      error: () => {
        this.error = 'Error enrolling student';
        this.enrolling = false;
      }
    });
  }
}

