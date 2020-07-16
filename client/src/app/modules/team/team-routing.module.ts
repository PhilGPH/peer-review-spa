import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowTeamComponent } from './show-team/show-team.component';
import { DetailsTeamComponent } from './details-team/details-team.component';
import { TeamResolverService } from '../../data/resolve/team-resolver.service';
import { InvitationResolverService } from '../../data/resolve/invitation-resolver.service';
import { TeamWorkItemsResolverService } from '../../data/resolve/team-reviews-resolver.service';
import { TeamReviewsResolverService } from '../../data/resolve/team-work-items-resolver.service';
import { SingleTeamResolverService } from '../../data/resolve/single-team-resolver.service';
import { UserResolverService } from '../../data/resolve/user-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: ShowTeamComponent,
    pathMatch: 'full',
    resolve: {
      teams: TeamResolverService,
      invitations: InvitationResolverService
    }
  },
  {
    path: ':id',
    component: DetailsTeamComponent,
    resolve: {
      team: SingleTeamResolverService,
      workItems: TeamWorkItemsResolverService,
      reviews: TeamReviewsResolverService,
      users: UserResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TeamRoutingModule {}
