import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { User } from '../../data/schema/user';
import { WorkItem } from '../../data/schema/work-item-view';
import { AuthService } from '../../data/service/auth.service';
import { PATHS } from '../../utils/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  username = '';
  isAdmin = false;
  workItems: WorkItem[] = [];
  reviews: WorkItem[] = [];
  allUsers: User[];
  loggedUser: User;
  userSubscription: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly auth: AuthService
  ) {}

  ngOnInit() {
    this.getOwnWorkItemsAndReviews();

    this.userSubscription = this.auth.currentUser$.subscribe(
      (res) => {
        this.loggedUser = res;
      });

    this.removeMyUsername();
  }

  private getOwnWorkItemsAndReviews() {
    this.route.data.subscribe(
      (data) => {
        this.workItems = data.workItems;
        this.reviews = data.reviews;
        this.allUsers = data.users;
      }
      );
    }

  private removeMyUsername() {
    this.allUsers.forEach(user => {
      if (user.id === this.loggedUser.id) {
        this.allUsers.splice(this.allUsers.indexOf(user), 1);
      }
    });
  }

  private showWorkItem(id: string) {
    this.router.navigate([`${PATHS.workItem.main}/${id}`]);
  }
}
