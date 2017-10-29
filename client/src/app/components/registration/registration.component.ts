import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Router } from '@angular/router';
import { AuthService } from '../../security/auth.service';
import { NotificationService } from '../../services/notification.service';

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
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  @Output() onRegistrationClosed = new EventEmitter<Boolean>(); 
  form: FormGroup;
  showForm = true;
  registrationFailed = false;

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
        firstname: [null, [Validators.required, Validators.minLength(2)]],
        lastname: [null, [Validators.required, Validators.minLength(2)]],
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(4)]],
        confirm_password: [null, [Validators.required, Validators.minLength(4), passwordConfirming]],
    });
  }

  closeForm(){
    this.showForm = false;
    this.onRegistrationClosed.emit(this.showForm);
  }

  onRegister(userInfo) {
    this.auth.register(userInfo).then(() => {
      this.router.navigate(['']);
      this.showForm = false;
      this.onRegistrationClosed.emit(this.showForm); 
    }).catch((err) => {
      this.registrationFailed = true;
    });
  }
}


