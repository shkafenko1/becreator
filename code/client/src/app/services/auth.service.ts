import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'admin' | 'student';
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  public readonly user = this.currentUser.asReadonly();

  constructor(
    private api: ApiService,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        this.currentUser.set(JSON.parse(userStr));
      } catch (e) {
        this.logout();
      }
    }
  }

  register(email: string, password: string, fullName: string, role: 'admin' | 'student' = 'student'): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/register', {
      email,
      password,
      fullName,
      role
    }).pipe(
      tap(response => {
        if (response.success) {
          this.setAuth(response.data);
        }
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/login', {
      email,
      password
    }).pipe(
      tap(response => {
        if (response.success) {
          this.setAuth(response.data);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  private setAuth(data: { user: User; token: string }): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.currentUser.set(data.user);
  }

  isAuthenticated(): boolean {
    return !!this.currentUser() && !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  isStudent(): boolean {
    return this.currentUser()?.role === 'student';
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  refreshUser(): Observable<any> {
    return this.api.get<any>('/auth/me').pipe(
      tap(response => {
        if (response.success && response.data?.user) {
          const user = response.data.user;
          this.currentUser.set(user);
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
    );
  }
}


