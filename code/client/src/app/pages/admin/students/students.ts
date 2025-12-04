import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './students.html',
  styleUrl: './students.scss'
})
export class Students implements OnInit {
  students: any[] = [];
  loading = true;
  error: string = '';

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
}

