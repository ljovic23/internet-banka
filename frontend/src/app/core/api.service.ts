import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // bez završne kose crte
  private readonly baseUrl = 'https://internet-banka-2.onrender.com';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{ access_token: string }>(
      `${this.baseUrl}/auth/login`,
      { email, password }
    );
  }

  myAccounts() {
    return this.http.get(`${this.baseUrl}/accounts/mine`);
  }

  transfer(toIban: string, amount: number) {
    return this.http.post(`${this.baseUrl}/accounts/transfer`, { toIban, amount });
  }

  transactions(iban: string) {
    return this.http.get(`${this.baseUrl}/transactions/${iban}`);
  }
}
