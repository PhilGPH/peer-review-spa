import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { CreateTeamDialogComponent } from './create-team-dialog.component';
import { Team } from 'src/app/data/schema/team';
import { Invitation } from 'src/app/data/schema/invitation';
import { TeamService } from 'src/app/data/service/team.service';
import { NotificatorService } from 'src/app/core/service/notificator.service';
import { PATHS } from '../../../utils/constants';

@Component({
  selector: 'app-show-team',
  templateUrl: './show-team.component.html',
  styleUrls: ['./show-team.component.scss']
})

export class ShowTeamComponent implements OnInit {
  public teams: Team[] = [];
  public invitations: Invitation[] = [];
  public createTeamName = '';

  constructor(
    private readonly notificator: NotificatorService,
    private readonly route: ActivatedRoute,
    private readonly teamService: TeamService,
    private readonly router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllTeams();
  }

  getAllTeams(): void {
    this.route.data.subscribe(
      (data) => {
        this.teams = data.teams;
        this.invitations = data.invitations;
      }
    );
  }

  showTeam(id: string): void {
    this.router.navigate([`${PATHS.team.main}/${id}`]);
  }

  saveTeam(name: string): void {
    this.teamService.createTeam(name.trim())
      .subscribe(
        (result: Team) => {
          this.teams.push(result);
          this.updateInvitationsList();
          this.notificator.success('Team has been created!');
        },
        (error: ErrorEvent) => {
          this.notificator.error(error.error);
        }
      );
  }

  createTeam(): void {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      width: '360px',
      data: { name: this.createTeamName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createTeamName = result;
        this.saveTeam(result);
      }
    });
  }

  updateInvitation(id: string, answer: boolean): void {
    const status = answer ? 'accepted' : 'rejected';
    this.teamService.updateInvitation(id, status)
      .subscribe(
        (invitation: Invitation) => {
          const index = this.invitations.findIndex(el => el.id === invitation.id);
          this.updateTeamsList();
          this.invitations.splice(index, 1, invitation);
          this.notificator.success(`The invitation was successfully ${answer ? 'accepted' : 'rejected'}!`);
        },
        (error: ErrorEvent) => {
          this.notificator.error(error.error);
        }
      );
  }

  updateTeamsList(): void {
    this.teamService.getTeams()
      .subscribe(
        (res: Team[]) => {
          this.teams = res;
        }
      );
  }

  updateInvitationsList(): void {
    this.teamService.getInvitations()
      .subscribe(
        (res: Invitation[]) => {
          this.invitations = res;
        }
      );
  }
}
