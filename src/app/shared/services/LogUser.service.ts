import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchParam } from 'src/app/shared/utils/search-param';
import { AppUtil } from 'src/app/shared/utils/App-util';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LogUserService {
    private serviceURL: string;
    private httpOptions: any;

    constructor(private http: HttpClient) {
        this.serviceURL = environment.apiUrl;
        this.httpOptions = new AppUtil().httpHeaders();
    }

    public findAll() {
        return this.http.get(this.serviceURL + '/Logs_automatique', this.httpOptions);
    }
    public search(searchParam: SearchParam) {
        return this.http.post(this.serviceURL + '/log/find', searchParam, this.httpOptions);
    }
}
