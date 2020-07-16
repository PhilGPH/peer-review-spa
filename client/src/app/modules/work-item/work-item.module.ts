import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ErrorInterceptor } from '../../core/interceptor/error.interceptor';
import { TokenInterceptorService } from '../../core/interceptor/token.interceptor';
import { SingleWorkItemResolver } from '../../data/resolve/single-work-item-resolver.service';
import { UserResolverService } from '../../data/resolve/user-resolver.service';
import { WorkItemResolverService } from '../../data/resolve/work-item-resolver.service';
import { SharedModule } from '../../shared/shared.module';
import { CommentComponent } from './work-item-details/comment/comment.component';
import { WorkItemDetailsComponent } from './work-item-details/work-item-details.component';
import { WorkItemRoutingModule } from './work-item-routing.module';

@NgModule({
  declarations: [
    WorkItemDetailsComponent,
    CommentComponent
  ],
  imports: [SharedModule, FormsModule, WorkItemRoutingModule],
  providers: [
    WorkItemResolverService,
    UserResolverService,
    SingleWorkItemResolver,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
})

export class WorkItemModule {}
