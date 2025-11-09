import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AppToastService {
  private appName: string;

  constructor(public toastr: ToastrService) {
    this.appName = 'NOVUS';
  }

  success(message) {
    this.toastr.success(message, this.appName);
  }

  info(message) {
    this.toastr.info(message, this.appName);
  }

  warning(message) {
    this.toastr.warning(message, this.appName);
  }

  error(message) {
    this.toastr.error(message, this.appName, { closeButton: true });
  }

  titleClass(message) {
    this.toastr.info(message, this.appName, {titleClass: 'h3'});
  }

  // Message Class
  messageClass(message) {
    this.toastr.info(message, this.appName, {messageClass: 'text-uppercase'});
  }

}
