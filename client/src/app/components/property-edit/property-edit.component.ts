import { ElementRef, NgZone, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Router } from '@angular/router';
import { AuthService } from '../../security/auth.service';
import { NotificationService } from '../../services/notification.service';
import { PropertyCategoryService } from '../../services/property-category.service';
import { PropertyService } from '../../services/property.service';
import { PropertyCategory } from '../../models/property-category';
import {} from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { Property } from '../../models/property';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-property-edit',
  templateUrl: './property-edit.component.html',
  styleUrls: ['./property-edit.component.css']
})
export class PropertyEditComponent implements OnInit {
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  dailyPrice: number;
  weeklyPrice: number;
  form: FormGroup;
  slug: string;
  zoom = 11; // for google map
  propertyCategories: PropertyCategory[];
  property: Property;
  primaryImage: File;
  additionalImages: File[];

  @ViewChild('searchLoc') searchElementRef: ElementRef;
  @ViewChild('primaryImageInput') primaryImageInput;
  @ViewChild('additionalImagesInput') additionalImagesInput;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private auth: AuthService,
              private helper: Helper,
              private propertyService: PropertyService,
              private propertyCategoryService: PropertyCategoryService,
              private formBuilder: FormBuilder,
              private notification: NotificationService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {
  }

  ngOnInit() {
    this.getPropertyDetails();
    this.loadCategories();
    this.setCurrentUserLocation();

    this.form = this.formBuilder.group({
      name: [this.name, [Validators.required, Validators.minLength(4)]],
      dailyPrice: [this.dailyPrice, [Validators.required, priceConfirming]],
      weeklyPrice: [this.weeklyPrice, [Validators.required, priceConfirming]],
      address: [this.address, [Validators.required]],
      category: [null, [Validators.required]],
      description: [this.description, [Validators.required, Validators.minLength(5)]],
      locationLatitude: [this.latitude],
      locationLongitude: [this.longitude],
      primaryImage: [],
      additionalImages: [],
    });

    // Load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
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
  }

  onPrimaryImageChange(event) {
    const fileInput = this.primaryImageInput.nativeElement;
    if (fileInput.files && fileInput.files[0]) {
      this.primaryImage = fileInput.files[0];
    }
  }

  onAdditionalImagesChange(event) {
    const fileInput = this.additionalImagesInput.nativeElement;
    this.additionalImages = [];
    if (fileInput.files && fileInput.files) {
      for (let i = 0; i < fileInput.files.length; i++) {
        if (fileInput.files[i]) {
          this.additionalImages.push(fileInput.files[i]);
        }
      }
    }
  }

  getPropertyDetails() {
    this.slug = this.route.snapshot.params['slug'];

    this.propertyService.getProperty(this.slug)
        .then((data) => {
          this.property = data as Property;
          this.latitude = this.property.locationLatitude;
          this.longitude = this.property.locationLongitude;
          this.form.controls['locationLatitude'].setValue(this.latitude);
          this.form.controls['locationLongitude'].setValue(this.longitude);
          this.address = this.property.address;
          this.name = this.property.name;
          this.description = this.property.description;
          this.dailyPrice = this.property.dailyPrice;
          this.weeklyPrice = this.property.weeklyPrice;
        })
        .catch((e) => this.notification.errorResp(e));
  }

  editProperty() {
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

    this.propertyService.editProperty(formData, this.property.id)
        .then(() => {
          this.notification.success('Property has updated successfully!');
          this.router.navigate(['/']);
        })
        .catch((err) => {
          this.notification.error('Updating the property failed!');
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

  private setCurrentUserLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }
}
