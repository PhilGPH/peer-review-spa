import { Injectable } from '@angular/core';
import { NotificatorService } from '../../core/service/notificator.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { TeamService } from 'src/app/data/service/team.service';
import { Invitation } from 'src/app/data/schema/invitation';

@Injectable()
export class InvitationResolverService implements Resolve<Invitation[]> {

  constructor(
    private readonly teamService: TeamService,
    private readonly notificator: NotificatorService,
  ) { }

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) {

    return this.teamService.getInvitations()
      .pipe(catchError(
        res => {
          this.notificator.error(res.error.error);
          // Alternativle, if the res.error.code === 401, you can logout the user and redirect to /home
          return of([]);
        }
      ));
  }
}
