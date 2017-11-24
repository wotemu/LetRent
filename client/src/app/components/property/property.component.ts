import { ElementRef, NgZone, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../security/auth.service';
import { NotificationService } from '../../services/notification.service';
import { PropertyCategoryService } from '../../services/property-category.service';
import { PropertyService } from '../../services/property.service';
import { PropertyCategory } from '../../models/property-category';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import {} from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { Property } from '../../models/property';
import { Helper } from '../../utils/helper';

function priceConfirming(c: AbstractControl): any {
  if (!c.parent || !c) return;
  const dPrice = c.parent.get('dailyPrice');
  const wPrice = c.parent.get('weeklyPrice');

  if (dPrice.value || wPrice.value) {
    return;
  } else {
    return {invalid: true};
  }
}

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class AddPropertyComponent implements OnInit {

  address: string;
  latitude: number;
  longitude: number;
  dailyPrice: number;
  weeklyPrice: number;
  zoom: number;
  property: Property;
  propertyCategories: PropertyCategory[];
  form: FormGroup;
  primaryImage: File;
  additionalImages: File[];

  @ViewChild('search') searchElementRef: ElementRef;
  @ViewChild('primaryImageInput') primaryImageInput;
  @ViewChild('additionalImagesInput') additionalImagesInput;

  constructor(private router: Router,
              public auth: AuthService,
              private helper: Helper,
              private propertyService: PropertyService,
              private propertyCategoryService: PropertyCategoryService,
              private formBuilder: FormBuilder,
              private notification: NotificationService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {
  }

  ngOnInit() {
    this.loadCategories();

    // set google maps defaults, default location is Helsinki
    this.zoom = 11;
    this.latitude = 60.192059;
    this.longitude = 24.945831;
    this.setCurrentPosition();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.address = place.formatted_address;
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.form.controls['locationLatitude'].setValue(this.latitude);
          this.form.controls['locationLongitude'].setValue(this.longitude);
          this.zoom = 12;
        });
      });
    });

    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(4)]],
      dailyPrice: [this.dailyPrice, [Validators.required, priceConfirming]],
      weeklyPrice: [this.weeklyPrice, [Validators.required, priceConfirming]],
      address: [this.address, [Validators.required]],
      category: [null, [Validators.required]],
      description: [null, [Validators.required, Validators.minLength(5)]],
      locationLatitude: [this.latitude],
      locationLongitude: [this.longitude],
      primaryImage: [],
      additionalImages: [],
    });
  }

  addProperty(property) {
    const formData = this.helper.objectToFormData(this.form.value);

    if (this.primaryImage) {
      formData.append('primaryImage', this.primaryImage, this.primaryImage.name);
    }
    if (this.additionalImages && this.additionalImages.length) {
      for (let i = 0; i < this.additionalImages.length; i++) {
        let img = this.additionalImages[i];
        // formData.append('additionalImages[' + i + ']', img, img.name);
        formData.append('additionalImages[]', img, img.name);
      }
    }

    this.propertyService.addProperty(formData).then(() => {
      this.notification.success('Property has added successfully!');
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
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  onPrimaryImageChange(event) {
    const fileInput = this.primaryImageInput.nativeElement;
    if (fileInput.files && fileInput.files[0]) {
      this.primaryImage = fileInput.files[0];
    }
  }

}
