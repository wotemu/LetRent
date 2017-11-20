import { ElementRef, NgZone, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../security/auth.service';
import { NotificationService } from '../../services/notification.service';
import { PropertyCategoryService } from '../../services/property-category.service';
import { PropertyService } from '../../services/property.service';
import { PropertyCategory } from '../../models/property-category';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { Property } from '../../models/property';

function priceConfirming(c: AbstractControl): any {
  if (!c.parent || !c) return;
  const dPrice = c.parent.get('dailyPrice');
  const wPrice = c.parent.get('weeklyPrice');

  if (dPrice.value || wPrice.value) {
    return;
  } else {
    return { invalid: true };
  }
}

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {

  address: string;
  latitude: number;
  longitude: number;
  dailyPrice: number;
  weeklyPrice: number;
  zoom: number;
  form: FormGroup;

  @ViewChild("search")
  searchElementRef: ElementRef;
  propertyCategories: PropertyCategory[];
  property: Property;

  constructor(private router: Router,
    public auth: AuthService,
    private propertyService: PropertyService,
    private propertyCategoryService: PropertyCategoryService,
    private formBuilder: FormBuilder,
    private notification: NotificationService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
    if (!auth.loggedIn()) {
      this.router.navigate(['/']);
      this.notification.error('Please login to see your profile page!');
    }
  }

  ngOnInit() {
    //load categories
    this.loadCategories();

    //set google maps defaults, default location is Helsinki
    this.zoom = 11;
    this.latitude = 60.192059;
    this.longitude = 24.945831;

    //create search FormControl

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude and zoom
          this.address = place.formatted_address;
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          //set form values
          this.form.controls['locationLatitude'].setValue(this.latitude);
          this.form.controls['locationLongitude'].setValue(this.longitude);
          this.zoom = 12;
        });
      });
    });

    //create the form
    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(4)]],
      dailyPrice: [this.dailyPrice, [Validators.required, priceConfirming]],
      weeklyPrice: [this.weeklyPrice, [Validators.required, priceConfirming]],
      address: [this.address, [Validators.required]],
      category: [null, [Validators.required]],
      description: [null, [Validators.required, Validators.minLength(5)]],
      locationLatitude: [this.latitude],
      locationLongitude: [this.longitude]
    });
  }

  addProperty(property) {
    const propertyObject = property as Property;
    this.propertyService.addProperty(propertyObject).then(() => {
      this.notification.success("Property has added successfully!");
      this.router.navigate(['/']);
    }).catch((err) => {
      this.notification.error('Adding the property failed!');
      this.notification.error(err);
    });
  }

  private loadCategories() {
    this.propertyCategoryService.getPropertyCategories()
      .then((data) => {
        this.propertyCategories = data as PropertyCategory[];
      })
      .catch((e) => this.notification.errorResp(e));
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

}
