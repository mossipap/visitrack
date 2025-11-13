import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import { AppUtil } from 'src/app/shared/utils/App-util';
import { Service } from '../models/service';

@Injectable({
    providedIn: 'root'
})
export class ServiceService {
    private serviceURL: string;
    private httpOptions: any;

    constructor(private http: HttpClient) {
        this.serviceURL = environment.apiUrl;
        this.httpOptions = new AppUtil().httpHeaders();
    }

    public findAll() {
      return this.http.get(this.serviceURL + '/Service?Service=available' , this.httpOptions);
    }

    public save(typeUser: Service) {
        return this.http.post(this.serviceURL + '/Service', typeUser, this.httpOptions);
    }

    public update(typeUser: Service) {
        return this.http.put(this.serviceURL + '/Service/'+typeUser.id, typeUser, this.httpOptions);
    }
 public updateStatut(typeUser: Service) {
        return this.http.put(this.serviceURL + '/Service/'+typeUser.id, typeUser, this.httpOptions);
    }
    public delete(typeUser: Service) {
        return this.http.delete(this.serviceURL + '/Service/'+typeUser.id, this.httpOptions);
    }
}
