import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../data/service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  isLogged: boolean;

  constructor(private readonly authService: AuthService) {}

  ngOnInit() {
    this.isLogged = false;
    this.subscription = this.authService.isAuthenticated$.subscribe(
      (username) => {
        if (username === null) {
          this.isLogged = false;
        } else {
          this.isLogged = true;
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
