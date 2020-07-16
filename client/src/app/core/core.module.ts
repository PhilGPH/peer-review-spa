import { HttpClientModule } from '@angular/common/http';
import { NgModule, SkipSelf, Optional } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';

import { AuthService } from '../data/service/auth.service';
import { TeamService } from '../data/service/team.service';
import { WorkItemService } from '../data/service/work-item.service';
import { NotificatorService } from './service/notificator.service';
import { StorageService } from './service/storage.service';

@NgModule({
  imports: [
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center',
      preventDuplicates: true
    }),
    HttpClientModule
  ],
  providers: [
    AuthService,
    StorageService,
    NotificatorService,
    WorkItemService,
    TeamService
  ]
})

export class CoreModule {
  constructor(@Optional() @SkipSelf() parent: CoreModule) {
    if (parent) {
      throw new Error('Core module is already provided.');
    }
  }
}
