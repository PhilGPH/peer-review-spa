import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AuthService } from '../../data/service/auth.service';
import { NotificatorService } from '../service/notificator.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly notificatorService: NotificatorService,
    private readonly router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      map(user => user !== null),
      tap(user => {
        if (!user) {
          this.notificatorService.error(`You're unauthorized to access this page!`);
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
