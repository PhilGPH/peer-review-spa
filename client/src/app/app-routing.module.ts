import { NgModule } from '@angular/core';

import { AuthGuard } from './core/guard/auth.guard';
import { RegisterComponent } from './modules/auth/register/register.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'work-item', loadChildren: './modules/work-item/work-item.module#WorkItemModule', canActivate: [AuthGuard] },
  { path: 'dashboard', loadChildren: './modules/dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard] },
  { path: 'team', loadChildren: './modules/team/team.module#TeamModule', canActivate: [AuthGuard] },
  { path: 'not-found' , component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
