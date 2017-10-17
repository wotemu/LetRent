import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../security/auth.service';
import { NotificationService } from '../../services/notification.service';

// Might be useful for local Auth & social networks:
// https://auth0.com/blog/introducing-angular2-jwt-a-library-for-angular2-authentication/

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent {
  showForm = true;
  constructor(public auth: AuthService,
              private notification: NotificationService,
              private router: Router) {
    if (auth.loggedIn()) {
      this.router.navigate(['']);
      this.notification.info('You have already been authorized.');
    }
  }

  closeForm(){
    this.showForm = false;
  };

  onLogin(credentials): void {
    this.auth.login(credentials).then(() => {
      this.router.navigate(['']);
    }).catch((err) => {
      this.notification.errorResp(err, 'Error occurred');
    });
  }
}
