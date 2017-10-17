import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './security/auth.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // template: `<h1>{{ title }}</h1><p>{{ description }} is cool </p>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Hello srvup 2!';
  description = 'A new app';
  query: string;
  private routeSub: any;
  showLogin  = false;

  constructor(public auth: AuthService,
              private toastManager: ToastsManager,
              private vcr: ViewContainerRef,
              private route: ActivatedRoute) {
    this.toastManager.setRootViewContainerRef(vcr);

    this.routeSub = route.params.subscribe((params) => {
      this.query = params['q'];
    });
  }

  showAndHideLogin(){
    if (!this.showLogin) {
      this.showLogin = true;
      console.log(this.showLogin);
    } else {
      this.showLogin = false;
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}
