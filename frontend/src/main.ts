import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/auth.interceptor';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    // fetch + interceptor
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideClientHydration(),
  ],
}).catch(console.error);
