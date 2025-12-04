import { Routes } from '@angular/router';
import { Profile } from './pages/profile/profile';
import { Home } from './pages/home/home';
import { adminGuard, studentGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: Home,
    },
    {
        path: 'profile',
        component: Profile,
        canActivate: [studentGuard]
    },
    {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
        canActivate: [adminGuard]
    },
    {
        path: 'admin/course',
        loadComponent: () => import('./pages/admin/course-management/course-management').then(m => m.CourseManagement),
        canActivate: [adminGuard]
    },
    {
        path: 'admin/settings',
        loadComponent: () => import('./pages/admin/site-settings/site-settings').then(m => m.SiteSettings),
        canActivate: [adminGuard]
    },
    {
        path: 'admin/students',
        loadComponent: () => import('./pages/admin/students/students').then(m => m.Students),
        canActivate: [adminGuard]
    },
    {
        path: 'lesson/:id',
        loadComponent: () => import('./pages/view/lesson/lesson').then(m => m.Lesson),
        canActivate: [studentGuard],
        data: { renderMode: 'client-only' }
    },
    {
        path: '**',
        redirectTo: ''
    }
];
