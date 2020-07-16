import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { NotificatorService } from '../../../core/service/notificator.service';
import { CreateWorkItem } from '../../../data/schema/create-work-item';
import { ItemTag } from '../../../data/schema/item-tag';
import { User } from '../../../data/schema/user';
import { WorkItem } from '../../../data/schema/work-item-view';
import { WorkItemService } from '../../../data/service/work-item.service';

@Component({
  selector: 'app-work-item-list',
  templateUrl: './work-item-list.component.html',
  styleUrls: ['./work-item-list.component.scss']
})

export class WorkItemListComponent implements OnInit {

  @Input() workItems: WorkItem[];
  public subscription: Subscription;
  public userSubscription: Subscription;
  public workItemTitle: string;
  public workItemDescription: string;
  public cancelCreation = true;
  @Input() allUsers: User[];
  public filteredUsers: User[];
  public selectedUsers: string[] = [];
  public tags: string[] = ItemTag;
  public chosenTag: string;

  constructor(
    private readonly workItemService: WorkItemService,
    private readonly notificator: NotificatorService,
  ) {}

  ngOnInit(): void {
    this.filterChange('');
  }

  createWorkItem(): void {
    const newItem: CreateWorkItem = {
      title: this.workItemTitle,
      description: this.workItemDescription,
      review: this.selectedUsers,
      tag: this.chosenTag
    };

    this.workItemService.createWorkItem(newItem).subscribe((res: any) => {
      this.workItems.push(res);
      this.notificator.success('Work item was created');
    });

    this.cancelCreation = true;
    this.selectedUsers = [];
    this.workItemTitle = '';
    this. workItemDescription = '';
  }

  toggleButton(): void {
    this.cancelCreation = !this.cancelCreation;
  }

  toggleUser(id): void {
    if (this.selectedUsers.includes(id)) {
      this.selectedUsers.splice(this.selectedUsers.indexOf(id), 1);
    } else {
      this.selectedUsers.push(id);
    }
  }

  filterChange(search: string): void {
    this.filteredUsers = this.allUsers.filter(user => {
      return user.username.match(search);
    });
  }

  chooseTag(tag): void {
    this.chosenTag = tag;
  }
}
