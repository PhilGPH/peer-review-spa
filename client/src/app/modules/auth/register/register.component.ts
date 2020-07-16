import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NotificatorService } from '../../../core/service/notificator.service';
import { User } from '../../../data/schema/user';
import { UserRegister } from '../../../data/schema/user-register';
import { AuthService } from '../../../data/service/auth.service';
import { REGEX_PASSWORD } from '../../../utils/constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth-styles.scss']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hide = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly notificator: NotificatorService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(REGEX_PASSWORD)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  register(newUser: UserRegister) {
    this.authService.register(newUser).subscribe(
      (res: User) => {
        this.notificator.success(`${res.username} successfully registered`);
        this.router.navigate(['/login']);
      },
      (err: ErrorEvent) => {
        this.notificator.error(err.error.error);
      }
    );
  }
}
