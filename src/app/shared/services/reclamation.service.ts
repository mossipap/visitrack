import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppUtil } from 'src/app/shared/utils/App-util';
import { environment } from 'src/environments/environment';
import { Reclamation } from '../models/reclamation ';

@Injectable({
    providedIn: 'root'
})
export class ReclamationService {
    private serviceURL: string;
    private httpOptions: any;
    constructor(private http: HttpClient) {
        this.serviceURL = environment.apiUrl;
        this.httpOptions = new AppUtil().httpHeaders();
    }
    public findAll() {
        return this.http.get(this.serviceURL + '/Reclamation' , this.httpOptions);
    }
    public findById(reclamationId: number) {
        return this.http.get(this.serviceURL + '/Reclamation/'+reclamationId , this.httpOptions);
    }
    public save(reclamation: Reclamation) {
        return this.http.post(this.serviceURL + '/Reclamation', reclamation, this.httpOptions);
    }
    public update(reclamation: Reclamation) {
        return this.http.put(this.serviceURL + '/Reclamation/'+reclamation.id, reclamation, this.httpOptions);
    }
    public updateStatut(reclamation: Reclamation) {
        return this.http.put(this.serviceURL + '/ChangeStatut/'+reclamation.id, reclamation, this.httpOptions);
    }
    public delete(reclamation: Reclamation) {
        return this.http.delete(this.serviceURL + '/Reclamation/'+reclamation.id, this.httpOptions);
    }
}
