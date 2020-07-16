import { Injectable } from '@angular/core';

import { ApiService } from './api.service';
import { PATHS } from '../../utils/constants';

@Injectable({
    providedIn: 'root'
})

export class CommentsService {
  constructor(private readonly api: ApiService) {}

  public createComment(workItemId, content) {
    return this.api.post(`${PATHS.workItem.main}/${workItemId}/comment`, content);
  }

  public updateComment(commentId, content) {
    return this.api.put(`${PATHS.workItem.comments}/${commentId}`, content);
  }

  public deleteComment(commentId) {
    return this.api.delete(`${PATHS.workItem.comments}/${commentId}`);
  }
}
