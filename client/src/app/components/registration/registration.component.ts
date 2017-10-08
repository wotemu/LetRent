import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../security/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  constructor(public auth: AuthService,
              private router: Router) {
    if (auth.loggedIn())
      console.log(auth.decodeToken());
    // else
    //   console.log('Not logged in');
  }

  onRegister(userInfo) {
    // console.log(userInfo);
    // this.auth.logout();

    this.auth.register(userInfo).then(() => {
      // this.router.navigate(['']);
    //   // TODO: Add msg - you have been registered successfully
      console.log('success');
    }).catch((err) => {
      console.error('err');
      // this.notificationService.loginError();
    });
  }
}
