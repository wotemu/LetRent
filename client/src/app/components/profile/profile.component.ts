import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../security/auth.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { NotificationService } from '../../services/notification.service';
import { Account } from '../../models/account';

function passwordConfirming(c: AbstractControl): any {
  if (!c || !c.parent) return;
  const pwd = c.parent.get('password');
  const cpwd = c.parent.get('confirm_password');

  if (!pwd || !cpwd) return;
  if (pwd.value !== cpwd.value) {
    return {invalid: true};
  }
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  user: Account;
  avatar: File;
  updateStarted: Boolean;
  updateSucceed: Boolean;
  updateFailed: Boolean;

  @ViewChild('fileInput') fileInput;

  constructor(public auth: AuthService,
              private accountService: AccountService,
              private notification: NotificationService,
              private router: Router,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstname: [null, [Validators.required, Validators.minLength(2)]],
      lastname: [null, [Validators.required, Validators.minLength(2)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(4)]],
      confirm_password: [null, [Validators.required, Validators.minLength(4), passwordConfirming]],
      avatar: [null],
    });
    this.getUserProfileInfo();
  }

  updateProfile(): void {
    const formData = new FormData();
    Object.getOwnPropertyNames(this.form.value).map((key: string) => {
      formData.append(key, this.form.value[key]);
    });

    if (this.avatar) {
      formData.append('avatar', this.avatar, this.avatar.name);
    }

    this.updateStarted = true;
    this.accountService.updateProfile(formData)
        .then(() => {
          this.updateSucceed = true;
          this.goHomePage();
          this.getUserProfileInfo();
        })
        .catch((err) => {
          this.updateFailed = false;
        });
  }

  getUserProfileInfo(): void {
    this.accountService.getUserProfileInfo()
        .then((account: Account) => {
          this.user = account;
          this.form.controls['firstname'].setValue(account.firstname);
          this.form.controls['lastname'].setValue(account.lastname);
          this.form.controls['email'].setValue(account.email);
        })
        .catch((e) => this.notification.errorResp(e));
  }

  onFileChange(event) {
    const fileInput = this.fileInput.nativeElement;
    if (fileInput.files && fileInput.files[0]) {
      this.avatar = fileInput.files[0];
    }
  }

  goBack() {
    this.updateStarted = false;
    this.updateSucceed = false;
  }

  goHomePage() {
    setTimeout(() => this.router.navigate(['']), 3000);
  }
}
