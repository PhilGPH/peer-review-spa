import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AddMemberData } from './add-member.interface';
import { User } from 'src/app/data/schema/user';
import { TeamService } from 'src/app/data/service/team.service';
import { NotificatorService } from 'src/app/core/service/notificator.service';

@Component({
  selector: 'app-add-member-dialog',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})

export class AddMemberDialogComponent implements OnInit {
  public allUsers: User[];
  public filteredUsers: User[];
  public teamId: string;

  constructor(
    public dialogRef: MatDialogRef<AddMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddMemberData,
    private readonly teamService: TeamService,
    private readonly notificator: NotificatorService
  ) {}

  ngOnInit(): void {
    this.allUsers = this.data.allUsers;
    this.teamId = this.data.teamId;
    this.filterChange('');
  }

  filterChange(search: string): void {
    this.filteredUsers = this.allUsers.filter(user => {
      return user.username.match(search);
    });
  }

  addMember(username: string): void {
    this.teamService.inviteUser(this.teamId, username)
      .subscribe(() => {
          const index = this.allUsers.findIndex(user => user.username === username);
          this.allUsers.splice(index, 1);
          this.filterChange('');
          this.notificator.success('User has been successfully invited!');
        },
        (error: ErrorEvent) => {
          this.notificator.error(error.error.error);
        }
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
