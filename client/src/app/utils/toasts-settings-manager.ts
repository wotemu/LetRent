import { Injectable, ComponentFactoryResolver, NgZone, ApplicationRef } from '@angular/core';
import { ToastsManager, ToastOptions } from 'ng2-toastr';

@Injectable()
export class ToastsSettingsManager extends ToastsManager {
  constructor(componentFactoryResolver: ComponentFactoryResolver, ngZone: NgZone, appRef: ApplicationRef, options: ToastOptions) {
    super(componentFactoryResolver, ngZone, appRef, Object.assign(options, {
      positionClass: 'toast-top-right',
      toastLife: 3000,
      showCloseButton: true
    }));
  }
}
