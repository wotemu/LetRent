import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthConfigConsts, JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Account } from '../models/account';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  user: Account;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http: Http) {
    if (this.loggedIn()) {
      // TODO: Refactor this method in order to match dictionary to Account model
      this.user = this.decodeToken() as Account;
    }
    console.log(this.user);
  }

  login(credentials) {
    return new Promise((resolve, reject) => {
      this.http.post('api/login/', credentials)
        .map((res) => res.text())
        .subscribe(
          (data) => {
            console.log(data);
            localStorage.setItem('token', data);
            this.user = this.decodeToken() as Account;
            resolve();
          },
          (error) => reject(error)
        );
    });
  }

  register(userInfo) {
    return new Promise((resolve, reject) => {
      this.http.post('api/register/', userInfo)
        .map((res) => res.text())
        .subscribe(
          (data) => {
            localStorage.setItem('token', data);
            this.user = this.decodeToken() as Account;
            resolve();
          },
          (error) => reject(error)
        );
    });
  }

  logout() {
    localStorage.removeItem('token');
  }

  loggedIn() {
    return tokenNotExpired('token');
  }

  get token() {
    return localStorage.getItem('token');
  }

  decodeToken() {
    return this.jwtHelper.decodeToken(this.token);
  }

  getTokenString() {
    return AuthConfigConsts.HEADER_PREFIX_BEARER + ' ' + this.token;
  }
}
