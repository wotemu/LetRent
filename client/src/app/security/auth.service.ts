import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthConfigConsts, JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Account } from '../models/account';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  user: Account;
  userInformationUpdated: Boolean;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http: Http,
              private notification: NotificationService,
              private router: Router) {
    if (this.loggedIn()) {
      this.user = this.decodeToken() as Account;
    }
  }

  login(credentials) {
    return new Promise((resolve, reject) => {
      this.http.post('api/login/', credentials)
          .map((res) => res.json())
          .subscribe(
              (data) => {
                localStorage.setItem('token', data['token']);
                this.user = this.decodeToken() as Account;
                this.notification.success('You logged in successfully!');
                resolve();
              },
              (error) => reject(error)
          );
    });
  }

  register(userInfo) {
    return new Promise((resolve, reject) => {
      this.http.post('api/register/', userInfo)
          .map((res) => res.json())
          .subscribe(
              (data) => {
                localStorage.setItem('token', data['token']);
                this.user = this.decodeToken() as Account;
                resolve();
              },
              (error) => reject(error)
          );
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['']);
    this.notification.success('You have been logged out successfully.');
  }

  loggedIn() {
    return tokenNotExpired('token');
  }

  get token() {
    return localStorage.getItem('token');
  }

  get userId() {
    if (!this.loggedIn()) {
      return null;
    }
    return this.decodeToken().user_id;
  }

  decodeToken() {
    return this.jwtHelper.decodeToken(this.token);
  }

  getTokenString() {
    return AuthConfigConsts.HEADER_PREFIX_BEARER + ' ' + this.token;
  }

  getUserInformation() {
    return this.user.firstname;
  }

/**
 * Updates current user information when profile is updated.
 * @param data : userInfo
 */
  setUserInformation(data) {
    this.user = data as Account;
  }
}
