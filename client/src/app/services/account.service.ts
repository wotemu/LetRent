import { Injectable } from '@angular/core';
import { Helper } from '../utils/helper';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from '../security/auth.service';
import { Account } from '../models/account';
import { Response } from '@angular/http';

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
// avatarUrl: string;
  getUserProfileInfo(): Promise<Account> {
    return this.authHttp
        .get(this.endpoint + 'info/')
        .toPromise()
        .then((response: Response) => response.json() as Account)
        .catch(this.helper.handlePromiseError);
  }

  updateProfile(formData: FormData) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(this.endpoint + 'update/', formData)
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
