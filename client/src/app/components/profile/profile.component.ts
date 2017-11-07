import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../security/auth.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { NotificationService } from '../../services/notification.service';
import { AuthHttp } from 'angular2-jwt';

function passwordConfirming(c: AbstractControl): any {
  if(!c.parent || !c) return;
  const pwd = c.parent.get('password');
  const cpwd= c.parent.get('confirm_password')

  if(!pwd || !cpwd) return ;
  if (pwd.value !== cpwd.value) {
      return { invalid: true };

  }
}

 @Component({
   selector: 'app-profile',
   templateUrl: './profile.component.html',
   styleUrls: ['./profile.component.css']
 })
 export class ProfileComponent implements OnInit {
  form: FormGroup;
  updateStarted: Boolean;
  updateSucceed: Boolean;
  updateFailed: Boolean;

  constructor(public auth: AuthService,
              private accountService: AccountService,
              private notification: NotificationService,
              private router: Router,
              private formBuilder: FormBuilder) {
      if (!auth.loggedIn()) {
        this.router.navigate(['/']);
        this.notification.error('Please login to see your profile page!');
      }
   }

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstname: [null, [Validators.required, Validators.minLength(2)]],
      lastname: [null, [Validators.required, Validators.minLength(2)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(4)]],
      confirm_password: [null, [Validators.required, Validators.minLength(4), passwordConfirming]],
    });
  }
  updateProfile(credentials): void {
    this.updateStarted = true;
    this.accountService.updateProfile(credentials).then(() => {
      this.updateSucceed = true;
      this.goHomePage();
    }).catch((err) => {
      this.updateFailed = false;
    });
  }

  goBack() {
    this.updateStarted = false;
    this.updateSucceed = false;
  }

  goHomePage() {
    setTimeout(() => this.router.navigate(['']), 3000);
  }

 }
