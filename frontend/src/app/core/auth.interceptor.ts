import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Samo što ide preko proxyja (počinje s /api)
  if (req.url.startsWith('/api')) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
  }
  return next(req);
};
