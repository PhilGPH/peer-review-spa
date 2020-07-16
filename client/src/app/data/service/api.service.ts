import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  apiURL = 'http://localhost:3000/api/';

  constructor(private readonly http: HttpClient) {}

  public get(endpoint: string): Observable<any> {
    return this.http.get(`${this.apiURL}${endpoint}`);
  }

  public post(endpoint: string, data = {}): Observable<any> {
    return this.http.post(`${this.apiURL}${endpoint}`, data);
  }

  public put(endpoint: string, data = {}): Observable<any> {
    return this.http.put(`${this.apiURL}${endpoint}`, data);
  }

  public delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.apiURL}${endpoint}`);
  }
}
