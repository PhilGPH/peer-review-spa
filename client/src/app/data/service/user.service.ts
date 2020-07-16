import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { User } from '../schema/user';
import { API_URL_METHOD, PATHS } from '../../utils/constants';

@Injectable({
    providedIn: 'root'
})

export class UserService {
  constructor(private readonly api: ApiService) {}

  getUser(username: string): Observable<User> {
    return this.api.get(`${PATHS.user}/${username}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.api.get(PATHS.user);
  }
}
