import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AppUtil } from 'src/app/shared/utils/App-util';
import { NotificationObjet } from '../models/notification';

@Injectable({
    providedIn: 'root'
})
export class NotifyService {
    private serviceURL: string;
    private httpOptions: any;

    constructor(private http: HttpClient) {
        this.serviceURL = environment.apiUrl;
        this.httpOptions = new AppUtil().httpHeaders();
    }

    public findAll() {
      return this.http.get(this.serviceURL + '/Notification' , this.httpOptions);
    }
    public findByEventUser(userId: number) {
        return this.http.get(this.serviceURL + '/NotificationEventByUser/'+userId , this.httpOptions);
    }
    public save(notify: NotificationObjet) {
        return this.http.post(this.serviceURL + '/Notification', notify, this.httpOptions);
    }
    public updateStatut(notify: NotificationObjet) {
        return this.http.put(this.serviceURL + '/StatutNotification/'+notify.id, notify, this.httpOptions);
    }
    public delete(notify: NotificationObjet) {
        return this.http.delete(this.serviceURL + '/Notification/'+notify.id, this.httpOptions);
    }
}
