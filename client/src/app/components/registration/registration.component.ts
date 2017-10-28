import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../security/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  @Output() onRegistrationClosed = new EventEmitter<Boolean>();  
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
    this.onRegistrationClosed.emit(this.showForm);
  }

  onRegister(userInfo) {
    this.auth.register(userInfo).then(() => {
      this.router.navigate(['']);
    }).catch((err) => {
      this.notification.errorResp(err);
    });
  }
}
