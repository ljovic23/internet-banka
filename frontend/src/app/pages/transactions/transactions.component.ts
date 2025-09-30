import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Transaction } from '../../shared/models';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <div class="card">
      <h2 style="margin-top:0">Prometi — {{ iban }}</h2>

      <div class="row" style="gap:10px; margin-bottom:10px; flex-wrap:wrap">
        <select class="input" style="max-width:160px" [(ngModel)]="type">
          <option value="">Sve</option>
          <option value="IN">Uplate</option>
          <option value="OUT">Isplate</option>
        </select>
        <input class="input" style="max-width:220px" placeholder="Opis sadrži…" [(ngModel)]="q">
        <input class="input" type="date" [(ngModel)]="from">
        <input class="input" type="date" [(ngModel)]="to">
        <button class="btn" (click)="clearFilters()">Očisti filtre</button>
      </div>

      <table class="table">
        <tr>
          <th>Datum</th><th>Opis</th><th>Protuiban</th><th style="text-align:right">Iznos (EUR)</th>
        </tr>
        <tr *ngFor="let t of filtered()">
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
  `
})
export class TransactionsComponent implements OnInit {
  iban=''; tx:Transaction[]=[];
  type=''; q=''; from=''; to='';

  constructor(private route:ActivatedRoute, private api:ApiService) {}
  ngOnInit(){ this.iban=this.route.snapshot.params['iban']; this.api.get<Transaction[]>(`/transactions/${this.iban}`).subscribe(t=>this.tx=t); }
  clearFilters(){ this.type=''; this.q=''; this.from=''; this.to=''; }
  filtered(){
    const q=this.q.toLowerCase(); const f=this.from?new Date(this.from).getTime():-Infinity; const t=this.to?new Date(this.to).getTime()+86400000:Infinity;
    return this.tx.filter(x=>{
      const isIn=!x.amount.startsWith('-');
      const typeOk=!this.type || (this.type==='IN'?isIn:!isIn);
      const qOk=!q || (x.description||'').toLowerCase().includes(q);
      const dt=new Date(x.createdAt).getTime(); const dateOk=dt>=f && dt<t;
      return typeOk && qOk && dateOk;
    });
  }
}
