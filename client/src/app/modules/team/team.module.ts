import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ErrorInterceptor } from '../../core/interceptor/error.interceptor';
import { TokenInterceptorService } from '../../core/interceptor/token.interceptor';
import { InvitationResolverService } from '../../data/resolve/invitation-resolver.service';
import { SingleTeamResolverService } from '../../data/resolve/single-team-resolver.service';
import { TeamResolverService } from '../../data/resolve/team-resolver.service';
import { TeamWorkItemsResolverService } from '../../data/resolve/team-reviews-resolver.service';
import { TeamReviewsResolverService } from '../../data/resolve/team-work-items-resolver.service';
import { UserResolverService } from '../../data/resolve/user-resolver.service';
import { AddMemberDialogComponent } from './details-team/add-member/add-member.component';
import { DetailsTeamComponent } from './details-team/details-team.component';
import { SharedModule } from '../../shared/shared.module';
import { CreateTeamDialogComponent } from './show-team/create-team-dialog.component';
import { ShowTeamComponent } from './show-team/show-team.component';
import { TeamRoutingModule } from './team-routing.module';

@NgModule({
  declarations: [ShowTeamComponent, CreateTeamDialogComponent, DetailsTeamComponent, AddMemberDialogComponent],
  imports: [
    CommonModule,
    TeamRoutingModule,
    SharedModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    TeamResolverService,
    InvitationResolverService,
    TeamWorkItemsResolverService,
    TeamReviewsResolverService,
    SingleTeamResolverService,
    UserResolverService
  ],
  entryComponents: [
    CreateTeamDialogComponent,
    AddMemberDialogComponent
  ]
})

export class TeamModule {}
