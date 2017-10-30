import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Account } from '../models/account';
import { Helper } from '../utils/helper';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class AccountService {
  private endpoint = '/api/profile/';

  constructor(private http: Http,
              private helper: Helper,
              private notification: NotificationService) {
  }

  updateProfile(credentials) {
    return new Promise((resolve, reject) => {
        this.http.post(this.endpoint, credentials)
            .map((res) => res.text())
            .subscribe(
                (data) => {
                  this.notification.success('Profile updated succesfully!');
                  resolve();
                },
                (error) => reject(error)
            );
      });
  }
}