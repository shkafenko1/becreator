import { Component, signal } from '@angular/core';
import { Header } from './components/shared/header/header';
import { AuthPlate } from './components/ui/landing/authPlate';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [Header, AuthPlate],
})
export class App {
  protected readonly title = signal('client');
}
