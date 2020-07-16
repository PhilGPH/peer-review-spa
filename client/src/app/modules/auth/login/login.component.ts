import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { NotificatorService } from '../../../core/service/notificator.service';
import { User } from '../../../data/schema/user';
import { UserLogin } from '../../../data/schema/user-login';
import { AuthService } from '../../../data/service/auth.service';
import { PATHS } from '../../../utils/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth-styles.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly notificator: NotificatorService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login(user: UserLogin) {
    this.authService.login(user).subscribe(
      (res: { user: User }) => {
        this.notificator.success(`${res.user.username} successfully logged in`);
        this.router.navigate([PATHS.dashboard]);
      },
      (err: ErrorEvent) => {
        this.notificator.error(err.error.error);
      },
    );
  }
}
