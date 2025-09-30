import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
import { ToastComponent } from './core/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  // light/dark tema spremljena u localStorage
  theme = (typeof window !== 'undefined' && localStorage.getItem('theme')) || 'light';

  constructor(private auth: AuthService) {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', this.theme === 'dark');
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', this.theme);
      document.documentElement.classList.toggle('dark', this.theme === 'dark');
    }
  }

  isAuthed() { return this.auth.isLoggedIn(); }
  logout() { this.auth.logout(); location.href = '/login'; }
}
