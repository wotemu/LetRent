import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
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
  @Output() onLoginClosed = new EventEmitter<Boolean>();
  showForm = true;
  loginFailed = false;
  form: FormGroup;

  constructor(public auth: AuthService,
              private notification: NotificationService,
              private router: Router,
              private formBuilder: FormBuilder) {
    if (auth.loggedIn()) {
      this.router.navigate(['']);
      this.notification.info('You have already been authorized.');
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(4)]],
    });
  }

  closeForm() {
    this.showForm = false;
    this.onLoginClosed.emit(this.showForm);
  };

  onLogin(credentials): void {
    this.auth.login(credentials).then(() => {
      this.router.navigate(['']);
      this.showForm = false;
      this.onLoginClosed.emit(this.showForm);
    }).catch((err) => {
      this.loginFailed = true;
    });
  }
}
