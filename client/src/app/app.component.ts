import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './security/auth.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private routeSub: any;
  query: string;
  showLogin = false;
  showRegistration = false;

  constructor(public auth: AuthService,
              private toastManager: ToastsManager,
              private vcr: ViewContainerRef,
              private route: ActivatedRoute) {
    this.toastManager.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.query = params['q'];
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  /**
   * Change status of login form according to status of child component.
   * @param status: Status of form
   */
  changeLoginStatus(status: boolean) {
    this.showLogin = status;
  }

  /**
   * Change status of registration form according to status of child component.
   * @param status: Status of form
   */
  changeRegistrationStatus(status: boolean) {
    this.showRegistration = status;
  }

  /**
   * Show and hide login form.
   */
  showAndHideLogin() {
    this.showLogin = !this.showLogin;
  }

  /**
   * Show and hide registration form.
   */
  showAndHideRegistration() {
    this.showRegistration = !this.showRegistration;
  }
}
