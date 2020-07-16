import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { NotificatorService } from 'src/app/core/service/notificator.service';
import { TeamService } from 'src/app/data/service/team.service';

@Injectable()
export class TeamReviewsResolverService implements Resolve<any> {

  constructor(
    private readonly teamService: TeamService,
    private readonly notificator: NotificatorService,
    ) { }

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) {
    return this.teamService.getSingleTeamReviews(route.params.id)
      .pipe(catchError(
        res => {
          this.notificator.error(res.error.error);
          // Alternativle, if the res.error.code === 401, you can logout the user and redirect to /home
          return of({});
        }
      ));
  }
}
