import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { NotificatorService } from 'src/app/core/service/notificator.service';
import { WorkItem } from '../../../data/schema/work-item-view';
import { User } from '../../../data/schema/user';
import { AuthService } from '../../../data/service/auth.service';
import { CommentsService } from 'src/app/data/service/comments.service';
import { WorkItemService } from 'src/app/data/service/work-item.service';
import { PATHS, ICONS, STATUS_COLORS } from '../../../utils/constants';
import { Review } from '../../../data/schema/review';
import { Comment } from '../../../data/schema/comment';

@Component({
  selector: 'app-work-item-details',
  templateUrl: './work-item-details.component.html',
  styleUrls: ['./work-item-details.component.scss']
})

export class WorkItemDetailsComponent implements OnInit, OnDestroy {

  private userSubscription: Subscription;
  public loggedUser: User;
  public workItem: WorkItem;
  public toggleEdit = false;
  public username = '';
  public newComment = '';
  public reviewers: User[] = [];
  public comments = [];
  public reviewer = false;
  public author = false;
  public hasReviewed = false;
  public userReviewStatus = 'pending';
  public icons = ICONS;
  public statusColors = STATUS_COLORS;
  public isMerged = false;

  constructor(
    private readonly authService: AuthService,
    private readonly commentService: CommentsService,
    private readonly workItemService: WorkItemService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly notificator: NotificatorService
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe(
      (res: User) => {
        this.loggedUser = res;
        this.username = res.username;
      }
    );
    this.getWorkItem();
  }

  private getWorkItem(): void {
    this.route.data.subscribe(
      (data: { workItem: WorkItem }) => {
        this.workItem = data.workItem;
        this.comments = data.workItem.comments.filter((comment: Comment) => !comment.isDeleted);
        this.isMerged = this.workItem.isMerged;
        if (this.username === this.workItem.assignee.username) {
          this.author = true;
        }
        this.checkIfReviewerAndExtractReviewers();
      }
    );
  }

  private checkIfReviewerAndExtractReviewers(): void {
    this.reviewers = this.workItem.review.map((review: Review) => {
      const user: User = review.__reviewer__;
      user.status = review.status.replace(/\s+/g, '_').toUpperCase();

      if (user.username === this.username) {
        this.reviewer = true;
        this.hasReviewed = true;
        this.userReviewStatus = review.status;
      }

      return user;
    });
  }

  public review(workItemId, status): void {
    this.workItemService.reviewWorkItem(status, workItemId)
      .subscribe(
        (res: WorkItem) => {
          this.hasReviewed = true;
          this.userReviewStatus = status;
          this.workItem = res;
          this.notificator.success('The review was successfull!');
          this.checkIfReviewerAndExtractReviewers();
        },
        (error: ErrorEvent) => {
          this.notificator.error(error.error.error);
        }
      );
  }

  
  public addComment(id: string): void {
    this.commentService.createComment(id, { content: this.newComment })
    .subscribe(
      (comment: Comment) => {
        this.comments.unshift(comment);
        this.newComment = '';
        this.notificator.success('New comment was created!');
        },
        (error: ErrorEvent) => {
          this.notificator.error(error.error.error);
        }
      );
    }

  public mergeItem(): void {
    this.workItemService.updateWorkItem({ isMerged: this.isMerged }, this.workItem.id).
      subscribe(() => {
        this.isMerged = true;
        this.notificator.success('You successfully merged this item!');
      },
      (error: ErrorEvent) => {
        this.notificator.error(error.error);
      });
  }
      
  public editButton(): void {
    this.toggleEdit = !this.toggleEdit;
  }
  
  public backToDashboard(): void {
    this.router.navigate([PATHS.dashboard]);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
