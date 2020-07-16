import { Injectable } from '@angular/core';
import { WorkItemService } from '../service/work-item.service';
import { NotificatorService } from '../../core/service/notificator.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class SingleWorkItemResolver implements Resolve<any> {

  constructor(
    private readonly workItemService: WorkItemService,
    private readonly notificator: NotificatorService,
  ) { }

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) {

    return this.workItemService.getWorkItemById(route.params.id)
      .pipe(catchError(
        res => {
          this.notificator.error(res.error.error);
          // Alternativle, if the res.error.code === 401, you can logout the user and redirect to /home
          return of({});
        }
      ));
  }
}
