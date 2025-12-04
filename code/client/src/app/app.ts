import { Component, signal } from '@angular/core';
import { Header } from './components/shared/header/header';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [Header, RouterModule],
})
export class App {
  protected readonly title = signal('client');
}