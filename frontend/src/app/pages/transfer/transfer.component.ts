import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Account } from '../../shared/models';
import { ToastService } from '../../core/toast.service';

/* ─── Lokalni helperi (opuštena validacija za naše seed IBAN-ove) ─── */
function cleanIban(s: string): string {
  return (s || '').replace(/\s+/g, '').toUpperCase();
}
function formatIban(s: string): string {
  return cleanIban(s).replace(/(.{4})/g, '$1 ').trim();
}
/** Prihvaćamo HR + 14–21 znamenka (seed koristi kraće IBAN-ove). */
function isLikelyHrIban(s: string): boolean {
  const c = cleanIban(s);
  if (!c.startsWith('HR')) return false;
  const rest = c.slice(2);
  return /^\d{14,21}$/.test(rest);
}

interface Beneficiary { name: string; iban: string; }

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card" style="max-width:880px">
      <h2 style="margin-top:0">Interni prijenos</h2>

      <div *ngIf="loading" class="alert" style="margin-bottom:12px">Učitavanje računa…</div>
      <div *ngIf="loadErr" class="alert error" style="margin-bottom:12px">
        {{ loadErr }} <button class="btn" (click)="reloadAccounts()">Učitaj ponovno</button>
      </div>

      <div class="grid grid-2">
        <!-- S računa -->
        <div class="stack">
          <label class="label">S računa</label>
          <select class="input" [(ngModel)]="fromIban" name="fromIban" [disabled]="loading || accounts.length===0" (change)="recalc()">
            <option *ngIf="!loading && accounts.length===0" disabled value="">— Nema dostupnih računa —</option>
            <option *ngFor="let a of accounts" [value]="a.iban">
              {{ a.iban }} — {{ a.balance | number:'1.2-2' }} EUR
            </option>
          </select>
          <small *ngIf="!loading && accounts.length===0" style="color:var(--muted)">
            Nemate dostupnih računa. Provjerite backend/seed.
          </small>
        </div>

        <!-- Na IBAN -->
        <div class="stack">
          <label class="label">Na IBAN</label>
          <input class="input"
                 [style.borderColor]="touchedTo && !ibanOk ? '#dc2626' : 'var(--border)'"
                 [(ngModel)]="toIban" name="toIban"
                 placeholder="npr. HR0000 1111 2222 3333"
                 (input)="recalc()"
                 (blur)="onToBlur()"/>
          <small style="color:var(--muted)">Primjer važećeg IBAN-a iz seeda: <b>HR0000111122223333</b></small>
          <div *ngIf="touchedTo && !ibanOk" class="alert error" style="margin-top:8px">
            Nevažeći IBAN (format: HR + 14–21 znamenka). Možete i dalje pokušati — backend će potvrditi.
          </div>

          <small style="color:var(--muted)">Spremljeni:
            <a *ngFor="let b of saved; let last=last" href="#"
               (click)="$event.preventDefault(); toIban=b.iban; touchedTo=true; recalc()">
              {{ b.name }}{{ last ? '' : ', ' }}
            </a>
          </small>
        </div>

        <!-- Iznos -->
        <div class="stack">
          <label class="label">Iznos</label>
          <input class="input" [(ngModel)]="amount" name="amount" type="number" step="0.01" min="0.01" placeholder="0.00" (input)="recalc()" />
        </div>

        <!-- Opis -->
        <div class="stack">
          <label class="label">Opis (opcionalno)</label>
          <input class="input" [(ngModel)]="description" name="description" placeholder="npr. Štednja" />
        </div>

        <div class="row" style="grid-column:1/-1; justify-content:space-between; margin-top:6px">
          <label class="row" style="gap:8px">
            <input type="checkbox" [(ngModel)]="saveBenef" />
            Spremi primatelja
          </label>
          <div class="row" style="gap:8px">
            <button type="button" class="btn" (click)="reset()">Poništi</button>
            <button class="btn btn-primary"
                    (click)="openConfirm()"
                    [disabled]="!canPay">
              Plati
            </button>
          </div>
        </div>
      </div>

      <!-- Potvrda -->
      <div *ngIf="confirmOpen" style="position:fixed; inset:0; background:rgba(0,0,0,.4); display:grid; place-items:center; z-index:1000">
        <div class="card" style="max-width:520px">
          <h3 style="margin-top:0">Potvrda plaćanja</h3>
          <p><b>S IBAN:</b> {{ fromIban }}</p>
          <p><b>Na IBAN:</b> {{ formattedTo }}</p>
          <p><b>Iznos:</b> {{ amount | number:'1.2-2' }} EUR</p>
          <p *ngIf="description"><b>Opis:</b> {{ description }}</p>
          <div class="row" style="justify-content:flex-end; gap:8px; margin-top:8px">
            <button class="btn" (click)="confirmOpen=false">Odustani</button>
            <button class="btn btn-primary" (click)="send()">Potvrdi</button>
          </div>
        </div>
      </div>

      <div *ngIf="ok" class="alert success" style="margin-top:12px">Uspješno izvršeno.</div>
      <div *ngIf="err" class="alert error" style="margin-top:12px">{{ err }}</div>
    </div>
  `
})
export class TransferComponent implements OnInit {
  accounts: Account[] = [];
  loading = false;
  loadErr = '';

  fromIban = '';
  toIban = '';
  formattedTo = '';
  touchedTo = false;

  amount = 10;
  description = '';
  ok = false;
  err = '';
  confirmOpen = false;
  saveBenef = false;

  saved: Beneficiary[] = [];

  // derived state
  ibanOk = false;
  canPay = false;

  constructor(private api: ApiService, private toast: ToastService) {}

  ngOnInit() {
    this.saved = this.loadSaved();
    this.reloadAccounts();
    this.recalc();
  }

  onToBlur() {
    this.touchedTo = true;
    this.toIban = formatIban(this.toIban);
    this.recalc();
  }

  recalc() {
    this.ibanOk = isLikelyHrIban(this.toIban);
    this.formattedTo = formatIban(this.toIban);
    // Dopuštamo plaćanje i s "opuštenim" IBAN-om – backend radi konačnu provjeru
    this.canPay = !!this.fromIban && this.amount > 0.009 && !this.loading && this.ibanOk;
  }

  reloadAccounts() {
    this.loading = true;
    this.loadErr = '';
    this.api.get<Account[]>('/accounts/mine').subscribe({
      next: a => {
        this.accounts = a || [];
        if (!this.fromIban && this.accounts.length) this.fromIban = this.accounts[0].iban;
        this.loading = false;
        this.recalc();
      },
      error: e => {
        this.loading = false;
        this.loadErr = e?.error?.message || 'Greška dohvaćanja računa';
        this.recalc();
      }
    });
  }

  openConfirm() {
    this.touchedTo = true;
    this.recalc();
    if (!this.canPay) {
      if (!this.ibanOk) this.toast.error('Provjerite IBAN (HR + 14–21 znamenka).');
      else if (!this.fromIban) this.toast.error('Odaberite račun s kojeg plaćate.');
      else if (this.amount <= 0) this.toast.error('Iznos mora biti veći od 0.');
      return;
    }
    this.confirmOpen = true;
  }

  send() {
    this.confirmOpen = false;
    this.ok = false; this.err = '';
    this.api.post('/accounts/transfer', {
      fromIban: this.fromIban,
      toIban: cleanIban(this.toIban),
      amount: +this.amount,
      description: this.description,
    }).subscribe({
      next: () => {
        this.ok = true;
        if (this.saveBenef) this.saveBeneficiary();
        this.toast.success('Prijenos izvršen');
      },
      error: (e) => {
        this.err = e?.error?.message || 'Greška';
        this.toast.error(this.err);
      }
    });
  }

  reset() {
    this.toIban = '';
    this.formattedTo = '';
    this.amount = 0;
    this.description = '';
    this.saveBenef = false;
    this.touchedTo = false;
    this.recalc();
  }

  // spremljeni primatelji u localStorage
  loadSaved(): Beneficiary[] {
    try { return JSON.parse(localStorage.getItem('beneficiaries') || '[]'); } catch { return []; }
  }
  saveBeneficiary() {
    const list = this.loadSaved();
    const iban = cleanIban(this.toIban);
    if (!list.some(x => x.iban === iban)) {
      list.push({ name: this.toIban, iban });
      localStorage.setItem('beneficiaries', JSON.stringify(list));
      this.saved = list;
    }
  }
}
