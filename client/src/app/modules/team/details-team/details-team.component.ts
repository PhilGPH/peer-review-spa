import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { WorkItem } from 'src/app/data/schema/work-item-view';
import { Team } from 'src/app/data/schema/team';
import { User } from 'src/app/data/schema/user';
import { AddMemberDialogComponent } from './add-member/add-member.component';
import { PATHS } from '../../../utils/constants';

@Component({
  selector: 'app-details-team',
  templateUrl: './details-team.component.html',
  styleUrls: ['./details-team.component.scss']
})

export class DetailsTeamComponent implements OnInit {
  public workItems: WorkItem[] = [];
  public reviews: WorkItem[] = [];
  public team: Team;
  public members: User[];
  public users: User[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getInfo();
  }

  getInfo(): void {
    this.route.data.subscribe(
      (data) => {
        this.team = data.team;
        this.workItems = data.workItems;
        this.reviews = data.reviews;
        this.users = data.users;
        this.filterMembers();
      }
    );
  }

  filterMembers(): void {
    const invitations = this.team.invitations;
    const allInvitedUsers = invitations.map((invitation) => {
      return invitation.user;
    });

    const usersAcceptedInvitation = invitations.filter(invitation => {
      return invitation.status === 'accepted';
    }).map( invitation => {
      return invitation.user;
    });

    this.users = this.users.filter(user => {
      if (allInvitedUsers.findIndex(invitedUser => invitedUser.id === user.id) >= 0) {
        return false;
      }
      return true;
    });

    this.members = usersAcceptedInvitation;
  }

  addMemberDialog(): void {
    this.dialog.open(AddMemberDialogComponent, {
      width: '360px',
      height: '500px',
      data: { allUsers: this.users, teamId: this.team.id }
    });
  }

  showWorkItem(id: string) {
    this.router.navigate([`${PATHS.workItem.main}/${id}`]);
  }
}
