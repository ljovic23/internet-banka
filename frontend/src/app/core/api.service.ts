import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base =
    (typeof window !== 'undefined' && location.hostname !== 'localhost')
      ? 'https://endearing-valkyrie-86d278.netlify.app'  // <-- zamijeni nakon deploya backenda
      : '/api';

  constructor(private http: HttpClient) {}
  get<T>(url: string)  { return this.http.get<T>(this.base + url); }
  post<T>(url: string, body: any) { return this.http.post<T>(this.base + url, body); }
}
