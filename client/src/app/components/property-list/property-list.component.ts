import { Component, OnInit, OnDestroy } from '@angular/core';
import { Property } from '../../models/property';
import { PropertyService } from '../../services/property.service';
import { NotificationService } from '../../services/notification.service';
import { ActivatedRoute, Router, NavigationEnd, Params } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit, OnDestroy {
  title = 'Properties';
  properties: Property[];
  noRecordsFound = false;

  private routerListener: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private propertyService: PropertyService,
              private notification: NotificationService) {
  }

  ngOnInit() {
    this.routerListener = this.route.params.subscribe((params: Params) => {
      this.reloadProperties();
    });
  }

  ngOnDestroy() {
    this.routerListener.unsubscribe();
  }

  private reloadProperties() {
    const queryParams = {};
    const currentUri = this.router.url;
    let lastSlugInUri = '';

    if (currentUri.startsWith('/category')) {
      const parts = currentUri.split('/');
      if (parts.length > 1) {
        lastSlugInUri = parts[parts.length - 1];
        queryParams['prop_cat_slug'] = lastSlugInUri;
      } else {
        console.error('Last slug was not found');
        return;
      }
    }

    this.propertyService.getProperties(queryParams)
        .then((data) => {
          this.properties = data as Property[];
          this.noRecordsFound = !(data.length > 0);
        })
        .catch((e) => this.notification.errorResp(e));
  }
}
