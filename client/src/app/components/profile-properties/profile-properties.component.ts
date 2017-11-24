import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Property } from '../../models/property';
import { PropertyService } from '../../services/property.service';


@Component({
  selector: 'app-profile-properties',
  templateUrl: './profile-properties.component.html',
  styleUrls: ['./profile-properties.component.css']
})
export class ProfilePropertiesComponent implements OnInit {

  properties: Property[];
  noRecordsFound: Boolean;

  alertTitle = 'Danger!';
  alertMessage = 'Are you sure that you want to permanently delete the selected property?';
  alertCancelClicked = false;

  constructor(private propertyService: PropertyService,
              private notification: NotificationService) {
  }

  ngOnInit() {
    this.reloadProperties();
  }

  deleteProperty(id: number, name: string) {
    this.propertyService.deleteProperty(id).then(() => {
      this.reloadProperties();
      this.notification.success(`Property ${name} was deleted successfully`);
    }).catch((err) => {
      this.notification.error(err);
    });
  }

  private reloadProperties() {
    this.propertyService.getProfileProperties()
        .then((data) => {
          this.properties = data as Property[];
          this.noRecordsFound = !(data.length > 0);
        })
        .catch((e) => this.notification.error(e));
  }
}
