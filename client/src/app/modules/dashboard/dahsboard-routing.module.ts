import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { ReviewingWorkItemsResolverService } from '../../data/resolve/reviewing-work-items-resolver.service';
import { OwnWorkItemsResolverService } from '../../data/resolve/own-work-items-resolver.service';
import { UserResolverService } from '../../data/resolve/user-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    pathMatch: 'full',
    resolve: {
      workItems: OwnWorkItemsResolverService,
      reviews: ReviewingWorkItemsResolverService,
      users: UserResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule {}
