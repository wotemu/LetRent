import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {ToastsManager} from 'ng2-toastr';

@Injectable()
export class NotificationService {
  constructor(private toastManager: ToastsManager) {
  }

  public error(response: Response): void {
    this.toastManager.error(response.json().data.error).catch((e) => console.error(e));
  }

  public success(message: string): void {
    this.toastManager.success(message);
  }
}
