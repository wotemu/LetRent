import { Component, OnInit, OnDestroy } from '@angular/core';
import { Property } from '../../models/property';
import { PropertyService } from '../../services/property.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit {
  public title = 'Properties';

  private properties: Property[];
  // private propertiesPromise: Promise<void | Property[]>;

  constructor(private propertyService: PropertyService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.reloadProperties();
  }

  private reloadProperties() {
    const queryParams = {};
    this.propertyService.getProperties(queryParams)
      .then((data) => {
        this.properties = data as Property[];
      })
      .catch((e) => this.notificationService.error(e));
  }
}
