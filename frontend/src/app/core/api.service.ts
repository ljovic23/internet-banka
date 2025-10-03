import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly renderBase = 'https://internet-banka.onrender.com';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  private get base(): string {
    if (isPlatformBrowser(this.platformId)) {
      
      return location.hostname === 'localhost' ? '/api' : this.renderBase;
    }
    return this.renderBase;
  }

  get<T>(url: string) {
    return this.http.get<T>(this.base + url);
  }

  post<T>(url: string, body: any) {
    return this.http.post<T>(this.base + url, body);
  }
}
