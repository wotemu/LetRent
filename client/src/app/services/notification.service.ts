import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { ToastsManager } from 'ng2-toastr';

// Doc.: https://www.npmjs.com/package/ng2-toastr

@Injectable()
export class NotificationService {
  constructor(private toastr: ToastsManager) {
    // Close toast on click
    this.toastr.onClickToast()
        .subscribe((toast) => {
          if (toast.timeoutId) {
            clearTimeout(toast.timeoutId);
          }
          this.toastr.dismissToast(toast);
        });
  }

  public success(message: string, title?: string): void {
    this.toastr.success(message, title);
  }

  public info(message: string): void {
    this.toastr.info(message);
  }

  public warning(message: string, title?: string): void {
    this.toastr.warning(message, title);
  }

  public error(message: string, title?: string): void {
    this.toastr.error(message, title);
  }

  public errorResp(response: Response, title?: string): void {
    console.log(response);
    const jsonResp = response.json();
    Object.keys(jsonResp).forEach((errorKey) => {
      const errorMsgs = jsonResp[errorKey];

      if (typeof errorMsgs === 'string') {
        this.error(errorMsgs, 'Error occurred');
      } else {
        for (let errorMsg of errorMsgs) { // Iterate over array of error msgs
          this.error(errorMsg, 'Error occurred');
        }
      }
    });
  }
}
