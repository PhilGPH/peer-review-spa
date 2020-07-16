import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { WorkItemService } from '../service/work-item.service';
import { WorkItem } from '../schema/work-item-view';
import { NotificatorService } from '../../core/service/notificator.service';

@Injectable({
    providedIn: 'root'
})

export class WorkItemResolverService implements Resolve<WorkItem[]> {
  constructor(
    private readonly workItemService: WorkItemService,
    private readonly notificator: NotificatorService
  ) {}

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) {
    return this.workItemService.allWorkItems()
      .pipe(catchError(
        (res: ErrorEvent) => {
          this.notificator.error(res.error.error);
          return of([]);
        }
    ));
  }
}
