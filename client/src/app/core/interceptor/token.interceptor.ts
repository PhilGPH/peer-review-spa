import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { StorageService } from '../service/storage.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private readonly storageService: StorageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ) {
    const token = this.storageService.get('token') || '';
    const updatedRequest = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });

    return next.handle(updatedRequest);
  }
}
