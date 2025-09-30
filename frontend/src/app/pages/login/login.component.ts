import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="container">
    <div class="card" style="max-width:720px; margin:40px auto">
      <h1 style="margin-top:0">Prijava</h1>
      <p style="color:var(--muted)">Unesite svoje podatke za pristup.</p>

      <form (ngSubmit)="doLogin()" class="grid grid-1" style="gap:14px">
        <div class="stack">
          <label class="label">Email</label>
          <input class="input" [(ngModel)]="email" name="email" placeholder="pera@bank.hr" />
        </div>

        <div class="stack">
          <label class="label">Lozinka</label>
          <input class="input" [(ngModel)]="password" name="password" type="password" placeholder="••••••••" />
        </div>

        <div class="row" style="justify-content:flex-end">
          <button class="btn btn-primary">Prijava</button>
        </div>

        <div *ngIf="error" class="alert error">{{ error }}</div>
      </form>
    </div>
  </div>
  `
})
export class LoginComponent {
  email = 'pera@bank.hr';
  password = 'test1234';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  doLogin() {
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: ({ accessToken }) => {
        this.auth.storeToken(accessToken);
        this.router.navigateByUrl('/');
      },
      error: (e) => {
        if (e.status === 0)      this.error = 'Mrežna greška (backend/proxy).';
        else if (e.status === 401) this.error = 'Neispravan email ili lozinka.';
        else                      this.error = e?.error?.message || 'Greška pri prijavi.';
      },
    });
  }
}
