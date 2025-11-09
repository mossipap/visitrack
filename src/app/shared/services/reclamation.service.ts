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
    public findById(profilId: number) {
        return this.http.get(this.serviceURL + '/Reclamation/'+profilId , this.httpOptions);
    }
    public findByCabinetId(cabinetId: number) {
        return this.http.get(this.serviceURL + '/ReclamationByCabinet/'+cabinetId , this.httpOptions);
    }
    public save(profil: Reclamation) {
        return this.http.post(this.serviceURL + '/Reclamation', profil, this.httpOptions);
    }
    public update(profil: Reclamation) {
        return this.http.put(this.serviceURL + '/Reclamation/'+profil.id, profil, this.httpOptions);
    }
    public delete(profil: Reclamation) {
        return this.http.delete(this.serviceURL + '/Reclamation/'+profil.id, this.httpOptions);
    }
}
