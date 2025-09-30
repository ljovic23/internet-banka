import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // ⬅️ Svi pozivi idu preko /api kako bi proxy preusmjerio na backend
  private base = '/api';

  constructor(private http: HttpClient) {}

  get<T>(url: string)  { return this.http.get<T>(this.base + url); }
  post<T>(url: string, body: any) { return this.http.post<T>(this.base + url, body); }
}
