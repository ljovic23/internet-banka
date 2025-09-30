import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'token';
  constructor(private api: ApiService) {}

  private hasWindow(){ return typeof window !== 'undefined'; }

  login(email: string, password: string): Observable<{ accessToken: string }> {
    return this.api.post<{ accessToken: string }>('/auth/login', { email, password });
  }

  storeToken(t: string) { if (this.hasWindow()) localStorage.setItem(this.tokenKey, t); }
  token() { return this.hasWindow() ? localStorage.getItem(this.tokenKey) : null; }
  isLoggedIn() { return !!this.token(); }
  logout() { if (this.hasWindow()) localStorage.removeItem(this.tokenKey); }
}
