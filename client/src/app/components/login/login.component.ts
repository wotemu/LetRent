import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { AuthService } from '../../security/auth.service';

// Might be useful for local Auth & social networks:
// https://auth0.com/blog/introducing-angular2-jwt-a-library-for-angular2-authentication/

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent {
  constructor(public auth: AuthService,
              // private notificationService: NotificationService,
              private router: Router,
              private http: Http) {
    if (auth.loggedIn()) {
      // TODO: Add message that user has been already authorized
      this.router.navigate(['']);
    }
  }

  onLogin(credentials): void {
    this.auth.login(credentials).then(() => {
      this.router.navigate(['']);
      // console.log('success');
    }).catch((err) => {
      // console.error('err');
      // this.notificationService.loginError();
    });
  }
}
