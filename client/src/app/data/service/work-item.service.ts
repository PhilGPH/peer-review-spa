import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateWorkItem } from '../schema/create-work-item';
import { UpdateWorkItem } from '../schema/update-work-item';
import { WorkItem } from '../schema/work-item-view';
import { PATHS } from '../../utils/constants';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})

export class WorkItemService {
  constructor(private readonly api: ApiService) {}

  public allWorkItems(): Observable<WorkItem[]> {
    return this.api.get(PATHS.workItem.main);
  }

  public getOwnWorkItems(): Observable<WorkItem[]> {
    return this.api.get(PATHS.workItem.own);
  }

  public getOwnReviewingWorkItems(): Observable<WorkItem[]> {
    return this.api.get(PATHS.workItem.ownReviews);
  }

  public getWorkItemById(id: string): Observable<WorkItem> {
    return this.api.get(`${PATHS.workItem.main}/${id}`);
  }

  public createWorkItem(newItem: CreateWorkItem): Observable<CreateWorkItem> {
    return this.api.post(PATHS.workItem.main, newItem);
  }

  public updateWorkItem(updateItem: UpdateWorkItem, id: string): Observable<WorkItem> {
    return this.api.put(`${PATHS.workItem.main}/${id}`, updateItem);
  }

  public reviewWorkItem(status: string, id: string): Observable<WorkItem> {
    return this.api.put(`${PATHS.workItem.review}/${id}`, {status});
  }
}
