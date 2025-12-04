import { Component, signal } from '@angular/core';
import { Header } from './components/shared/header/header';
import { Footer } from './components/shared/footer/footer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [Header, Footer, RouterModule],
})
export class App {
  protected readonly title = signal('client');
}