import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { WorkItem } from '../schema/work-item-view';
import { Invitation } from 'src/app/data/schema/invitation';
import { Team } from 'src/app/data/schema/team';
import { PATHS } from '../../utils/constants';

@Injectable({
    providedIn: 'root'
})

export class TeamService {
  constructor(private readonly api: ApiService) {}

  public getTeams(): Observable<Team[]> {
    return this.api.get(PATHS.team.all);
  }

  public getInvitations(): Observable<Invitation[]> {
    return this.api.get(PATHS.team.allInvitations);
  }

  public getSingleTeam(id: string): Observable<Team> {
    return this.api.get(`${PATHS.team.main}/${id}`);
  }

  public getSingleTeamWorkItems(id: string): Observable<WorkItem[]> {
    return this.api.get(`${PATHS.team.main}/${id}/workItems`);
  }

  public getSingleTeamReviews(id: string): Observable<WorkItem[]> {
    return this.api.get(`${PATHS.team.main}/${id}/reviews`);
  }

  public createTeam(name: string): Observable<Team> {
    return this.api.post(PATHS.team.main, { name });
  }

  public inviteUser(idTeam: string, username: string): Observable<Invitation> {
    return this.api.post(`${PATHS.team.main}/${idTeam}/invite?username=${username}`);
  }

  public updateInvitation(id: string, status: string): Observable<Invitation> {
    return this.api.put(`${PATHS.team.updateInvitation}/${id}`, { status });
  }
}
