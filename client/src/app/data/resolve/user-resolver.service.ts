import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../schema/user';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { NotificatorService } from '../../core/service/notificator.service';
import { UserService } from '../service/user.service';

@Injectable()
export class UserResolverService implements Resolve<User> {
  constructor(
    private readonly userService: UserService,
    private readonly notificator: NotificatorService
  ) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.getAllUsers().pipe(
      catchError(res => {
        this.notificator.error(res.error.message);
        return of(null);
      })
    );
  }
}
