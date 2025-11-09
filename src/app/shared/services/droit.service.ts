import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Profile } from 'src/app/shared/models/profil';
import { AppUtil } from 'src/app/shared/utils/App-util';

@Injectable({
    providedIn: 'root'
})
export class DroitService {
    private serviceURL: string;
    private httpOptions: any;

    constructor(private http: HttpClient) {
        this.serviceURL = environment.apiUrl;
        this.httpOptions = new AppUtil().httpHeaders();
    }

    public findAll() {
        return this.http.get(this.serviceURL + '/droits', this.httpOptions);
    }
}
