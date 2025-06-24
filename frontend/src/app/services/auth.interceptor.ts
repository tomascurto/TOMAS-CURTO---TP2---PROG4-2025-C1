import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem('token');

  let cloned = req;

  if (token) {
    cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

   return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return throwError(() => error);
    })
  );
};