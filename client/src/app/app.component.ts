import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { NotificatorService } from './core/service/notificator.service';
import { AuthService } from './data/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'client';

  public username: string;
  public isLogged: boolean;
  private subscription: Subscription;
  public isHome: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly notificator: NotificatorService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.username = '';
    this.isLogged = false;
    this.subscription = this.authService.isAuthenticated$.subscribe(username => {
      if (username === null) {
        this.username = '';
        this.isLogged = false;
      } else {
        this.username = username;
        this.isLogged = true;
      }
    });
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.isHome = event.url === '/home' ? true : false;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout() {
    this.authService.logout().subscribe(() => {
        this.notificator.success('Logout successful');
        this.router.navigate(['/home']);
      },
      (error: ErrorEvent) => {
        this.notificator.error(error.error.message);
      },
    );
  }
}
