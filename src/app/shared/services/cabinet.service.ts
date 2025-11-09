import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import { AppUtil } from 'src/app/shared/utils/App-util';
import { Cabinet } from '../models/cabinet';

@Injectable({
    providedIn: 'root'
})
export class CabinetService {
    private serviceURL: string;
    private httpOptions: any;

    constructor(private http: HttpClient) {
        this.serviceURL = environment.apiUrl;
        this.httpOptions = new AppUtil().httpHeaders();
    }

    public findAll() {
      return this.http.get(this.serviceURL + '/Service' , this.httpOptions);
    }
    public findById(cabinetId: number) {
        return this.http.get(this.serviceURL + '/Service/'+cabinetId , this.httpOptions);
    }

    public save(cabinet: Cabinet) {
        return this.http.post(this.serviceURL + '/Service', cabinet, this.httpOptions);
    }

    public update(cabinet: Cabinet) {
        return this.http.put(this.serviceURL + '/Service/'+cabinet.id, cabinet, this.httpOptions);
    }

    public updateStatut(cabinet: Cabinet) {
        return this.http.put(this.serviceURL + '/Servicestatut/'+cabinet.id, cabinet, this.httpOptions);
    }

    public delete(cabinet: Cabinet) {
        return this.http.delete(this.serviceURL + '/Service/'+cabinet.id, this.httpOptions);
    }
}
