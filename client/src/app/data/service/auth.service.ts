import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiService } from './api.service';
import { StorageService } from '../../core/service/storage.service';
import { User } from '../schema/user';
import { UserLogin } from '../schema/user-login';
import { UserRegister } from '../schema/user-register';
import { PATHS, UNAVAILABLE_WHEN_LOGGED } from '../../utils/constants';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
  private isAuthenticatedSubject$: BehaviorSubject<string | null> = new BehaviorSubject(this.username);
  private currentUserSubject$: BehaviorSubject<User> = new BehaviorSubject({} as User);

  constructor(
    private readonly api: ApiService,
    private readonly storage: StorageService,
    private readonly jwtHepler: JwtHelperService,
    private readonly router: Router
  ) {
      if (!this.username) {
        this.router.navigate([PATHS.home]);
      } else if (this.isTokenExpired) {
        this.isAuthenticatedSubject$.next(null);
        this.router.navigate([PATHS.auth.login]);
      } else if (this.username && Object.values(UNAVAILABLE_WHEN_LOGGED).includes(window.location.pathname)) {
        this.router.navigate([PATHS.dashboard]);
      } else {
        this.api.get(`${PATHS.user}/${this.username}`).subscribe(
          (res: User) => {
            this.isAuthenticatedSubject$.next(res.username);
            this.currentUserSubject$.next(res);
          }
        );
      }
    }

  public get isAuthenticated$(): Observable<string> {
    return this.isAuthenticatedSubject$.asObservable();
  }

  public get currentUser$(): Observable<User> {
    return this.currentUserSubject$.asObservable();
  }

  private get username(): string | null {
    const token = this.storage.get('token');
    if (token) {
      return this.jwtHepler.decodeToken(token).username;
    }

    return null;
  }

  private get isTokenExpired(): boolean {
    const token = this.storage.get('token');
    return token ? this.jwtHepler.isTokenExpired() : null;
  }

  public login(user: UserLogin): Observable<any> {
    return this.api.post(PATHS.auth.login, user).pipe(
      tap((res: any) => {
        this.isAuthenticatedSubject$.next(res.user.username);
        this.currentUserSubject$.next(res.user);
        this.storage.set('token', res.token);
      })
    );
  }

  public register(newUser: UserRegister): Observable<User> {
    return this.api.post(PATHS.auth.register, newUser);
  }

  public logout(): Observable<User> {
    const token = this.storage.get('token');
    return this.api.post(PATHS.auth.logout, token).pipe(
      tap((res: User) => {
        this.isAuthenticatedSubject$.next(null);
        this.currentUserSubject$.next({} as User);
        this.storage.remove('token');
      })
    );
  }
}
