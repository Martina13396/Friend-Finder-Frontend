import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {


    if (this.authService.isUserLogin()) {
      const token = sessionStorage.getItem('token');
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          }
        });
      }
    }
    return next.handle(request);
    }
  }

