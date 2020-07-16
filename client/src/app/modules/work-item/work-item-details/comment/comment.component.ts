import { Component, OnInit, Input } from '@angular/core';

import { NotificatorService } from 'src/app/core/service/notificator.service';
import { CommentsService } from 'src/app/data/service/comments.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {

  @Input()
  username: string;
  @Input()
  isAdmin: boolean;
  @Input()
  idWorkItem: string;
  @Input()
  comment;

  public isEditing = false;
  public isDeleted = false;

  constructor(
    private readonly commentService: CommentsService,
    private readonly notificator: NotificatorService
  ) {}

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  editSave(content): void {
    this.commentService.updateComment(this.comment.id, { content })
      .subscribe(
        (comment) => {
          this.comment.content = comment.content;
          this.isEditing = false;
          this.notificator.success('The comment was edited successfully!');
        },
        (error) => {
          this.notificator.error('There was an error with editing the comment');
        }
      );
  }

  delete(): void {
    this.commentService.deleteComment(this.comment.id)
      .subscribe(
        (comment) => {
          this.isDeleted = true;
          this.notificator.success('The comment was deleted successfully!');
        },
        (error) => {
          this.notificator.error('There was an error with deleting the comment');
        }
      );
  }
}
