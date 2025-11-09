import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import { AppUtil } from 'src/app/shared/utils/App-util';
import { TypeUser } from '../models/type-user';

@Injectable({
    providedIn: 'root'
})
export class TypeUserService {
    private serviceURL: string;
    private httpOptions: any;

    constructor(private http: HttpClient) {
        this.serviceURL = environment.apiUrl;
        this.httpOptions = new AppUtil().httpHeaders();
    }

    public findAll() {
      return this.http.get(this.serviceURL + '/Type_user?Type_user=available' , this.httpOptions);
    }

    public save(typeUser: TypeUser) {
        return this.http.post(this.serviceURL + '/Type_user', typeUser, this.httpOptions);
    }

    public update(typeUser: TypeUser) {
        return this.http.put(this.serviceURL + '/Type_user/'+typeUser.id, typeUser, this.httpOptions);
    }
 public updateStatut(typeUser: TypeUser) {
        return this.http.put(this.serviceURL + '/Type_user/'+typeUser.id, typeUser, this.httpOptions);
    }
    public delete(typeUser: TypeUser) {
        return this.http.delete(this.serviceURL + '/Type_user/'+typeUser.id, this.httpOptions);
    }
}
