import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ErrorInterceptor } from '../../core/interceptor/error.interceptor';
import { TokenInterceptorService } from '../../core/interceptor/token.interceptor';
import { OwnWorkItemsResolverService } from '../../data/resolve/own-work-items-resolver.service';
import { ReviewingWorkItemsResolverService } from '../../data/resolve/reviewing-work-items-resolver.service';
import { UserResolverService } from '../../data/resolve/user-resolver.service';
import { DashboardRoutingModule } from './dahsboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { WorkItemListComponent } from '../work-item/work-item-list/work-item-list.component';

@NgModule({
  declarations: [DashboardComponent, WorkItemListComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
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
    OwnWorkItemsResolverService,
    ReviewingWorkItemsResolverService,
    UserResolverService
  ]
})

export class DashboardModule {}
