import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../core/guard/auth.guard';
import { SingleWorkItemResolver } from '../../data/resolve/single-work-item-resolver.service';
import { WorkItemDetailsComponent } from './work-item-details/work-item-details.component';

export const routes: Routes = [
  {
    path: ':id',
    component: WorkItemDetailsComponent,
    canActivate: [AuthGuard],
    resolve: { workItem: SingleWorkItemResolver }
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class WorkItemRoutingModule {}
