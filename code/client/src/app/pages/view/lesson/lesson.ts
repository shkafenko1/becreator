import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { SafeUrlPipe } from '../../../pipes/safe-url.pipe';

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [CommonModule, RouterModule, SafeUrlPipe],
  templateUrl: './lesson.html',
  styleUrl: './lesson.scss'
})
export class Lesson implements OnInit {
  lesson: any = null;
  loading = true;
  error: string = '';
  lessonId: number = 0;
  isCompleted: boolean = false;

  constructor(
    protected route: ActivatedRoute,
    protected studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.lessonId = +params['id'];
      this.loadLesson();
    });
  }

  loadLesson(): void {
    this.loading = true;
    this.studentService.getLesson(this.lessonId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.lesson = response.data.lesson;
          // Check if completed (this would come from the API in a real implementation)
        } else {
          this.error = 'Failed to load lesson';
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error loading lesson';
        this.loading = false;
      }
    });
  }

  toggleComplete(): void {
    if (this.isCompleted) {
      this.studentService.markLessonIncomplete(this.lessonId).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.isCompleted = false;
          }
        }
      });
    } else {
      this.studentService.markLessonComplete(this.lessonId).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.isCompleted = true;
          }
        }
      });
    }
  }
}

