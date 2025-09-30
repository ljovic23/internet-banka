import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div style="position:fixed; right:18px; bottom:18px; display:grid; gap:10px; z-index:9999">
    <div *ngFor="let t of svc.items"
         [style.borderColor]="t.type==='success'?'#16a34a':t.type==='error'?'#dc2626':'#2563eb'"
         [style.background]="t.type==='success'?'#f0fdf4':t.type==='error'?'#fff1f2':'#eff6ff'"
         style="border:1px solid; padding:10px 12px; border-radius:10px; min-width:260px; box-shadow:0 6px 24px rgba(15,23,42,.1)">
      {{ t.text }}
    </div>
  </div>`,
})
export class ToastComponent { constructor(public svc: ToastService) {} }
