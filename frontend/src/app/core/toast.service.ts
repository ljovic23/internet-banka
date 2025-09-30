import { Injectable } from '@angular/core';
export type ToastType='success'|'error'|'info';
export interface Toast{ id:number; type:ToastType; text:string; }
@Injectable({providedIn:'root'})
export class ToastService{
  private _items:Toast[]=[]; private counter=0;
  get items(){ return this._items; }
  private push(type:ToastType,text:string,ms=3000){ const id=++this.counter;
    this._items=[...this._items,{id,type,text}]; setTimeout(()=>this.dismiss(id),ms); }
  success(t:string){ this.push('success',t); }
  error(t:string){ this.push('error',t,5000); }
  info(t:string){ this.push('info',t); }
  dismiss(id:number){ this._items=this._items.filter(x=>x.id!==id); }
}
