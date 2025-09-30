import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Account } from '../../shared/models';
import { formatIban } from '../../shared/iban';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="row" style="justify-content:space-between; align-items:center">
        <h2 style="margin:0">Računi</h2>
        <input class="input" style="max-width:260px" placeholder="Pretraži IBAN…" [(ngModel)]="q">
      </div>

      <table class="table" style="margin-top:12px">
        <tr><th>IBAN</th><th>Stanje</th><th style="width:120px"></th></tr>
        <tr *ngFor="let a of filtered()">
          <td>{{ format(a.iban) }}</td>
          <td>{{ a.balance | number:'1.2-2' }} EUR</td>
          <td><button class="btn" (click)="copy(a.iban)">Kopiraj</button></td>
        </tr>
      </table>
    </div>
  `
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  q=''; constructor(private api: ApiService) {}
  ngOnInit(){ this.api.get<Account[]>('/accounts/mine').subscribe(a=>this.accounts=a); }
  format = formatIban;
  filtered(){ const s=this.q.trim().toUpperCase(); return !s?this.accounts:this.accounts.filter(x=>x.iban.toUpperCase().includes(s)); }
  copy(iban:string){ navigator.clipboard.writeText(iban); alert('IBAN kopiran.'); }
}
