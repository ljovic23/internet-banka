import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Account, Transaction } from '../../shared/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  template: `
  <div class="grid grid-2">
    <div class="card">
      <h2 style="margin:0 0 12px 0">Moji računi</h2>
      <div *ngFor="let a of accounts" class="row" style="justify-content:space-between; border:1px dashed var(--border); border-radius:10px; padding:12px; margin-bottom:10px">
        <div>
          <div style="font-weight:600">{{ a.iban }}</div>
          <small style="color:var(--muted)">IBAN</small>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700">{{ a.balance | number:'1.2-2' }} EUR</div>
          <a [routerLink]="['/transactions', a.iban]" class="btn btn-ghost">Prometi</a>
        </div>
      </div>
      <div class="row" style="gap:8px">
        <a routerLink="/transfer" class="btn btn-primary">Novi prijenos</a>
        <a routerLink="/accounts" class="btn">Svi računi</a>
      </div>
    </div>

    <div class="card">
      <h2 style="margin:0 0 12px 0">Zadnje transakcije</h2>
      <p *ngIf="recent.length===0" style="color:var(--muted)">Nema stavki.</p>
      <table *ngIf="recent.length>0" class="table">
        <tr><th>Datum</th><th>Opis</th><th>IBAN</th><th style="text-align:right">Iznos</th></tr>
        <tr *ngFor="let t of recent">
          <td>{{ t.createdAt | date:'short' }}</td>
          <td>{{ t.description || '-' }}</td>
          <td>{{ t.counterpartyIban || '-' }}</td>
          <td style="text-align:right"
              [class.amount-pos]="!t.amount.startsWith('-')"
              [class.amount-neg]="t.amount.startsWith('-')">
            {{ t.amount }}
          </td>
        </tr>
      </table>
    </div>
  </div>
  `
})
export class DashboardComponent implements OnInit {
  accounts: Account[] = [];
  recent: Transaction[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.get<Account[]>('/accounts/mine').subscribe(a => {
      this.accounts = a;
      if (a.length) this.api.get<Transaction[]>(`/transactions/${a[0].iban}`).subscribe(t => this.recent = t.slice(0,5));
    });
  }
}
