import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './security/auth.service';

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

  constructor(public auth: AuthService,
              private route: ActivatedRoute) {
    this.routeSub = route.params.subscribe((params) => {
      this.query = params['q'];
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
