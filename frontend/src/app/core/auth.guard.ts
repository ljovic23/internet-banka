import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (_route, state) => {
  const ok = typeof window !== 'undefined' && !!localStorage.getItem('token');
  if (ok) return true;
  inject(Router).navigate(['/login'], { queryParams: { redirect: state.url } });
  return false;
};
