import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Account } from '../models/account';
import { Helper } from '../utils/helper';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from '../security/auth.service';
import {Headers} from '@angular/http'
import { RequestOptions } from '@angular/http';

@Injectable()
export class AccountService {
  private endpoint = '/api/profile/';
  userInfo: any;
  updateStatus: Boolean;
  errorText: String;

  constructor(public auth: AuthService,
              private authHttp: AuthHttp,
              private helper: Helper) {
  }

  updateProfile(credentials) {
    return new Promise((resolve, reject) => {
        this.authHttp.post(this.endpoint, credentials)
            .map((res) => res.json())
            .subscribe(
                (data) => {
                  this.auth.setUserInformation(data);
                  resolve();
                },
                (error) => {
                  reject(error);
                }
            );
      });
  }
}
