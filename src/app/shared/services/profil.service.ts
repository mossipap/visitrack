import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppUtil } from 'src/app/shared/utils/App-util';
import { environment } from 'src/environments/environment';
import { Profil } from '../models/profil';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private serviceURL: string;
    private httpOptions: any;

    constructor(private http: HttpClient) {
        this.serviceURL = environment.apiUrl;
        this.httpOptions = new AppUtil().httpHeaders();
    }

    public findAll() {
        return this.http.get(this.serviceURL + '/Profil' , this.httpOptions);
    }
    public findById(profilId: number) {
        return this.http.get(this.serviceURL + '/Profil/'+profilId , this.httpOptions);
    }
    public findByCabinetId(cabinetId: number) {
        return this.http.get(this.serviceURL + '/ProfilByCabinet/'+cabinetId , this.httpOptions);
    }
    public findDroitByProfilId(profilId: number) {
        return this.http.get(this.serviceURL + '/DroitByProfilId/'+profilId , this.httpOptions);
    }
    public save(profil: Profil) {
        return this.http.post(this.serviceURL + '/Profil', profil, this.httpOptions);
    }
    public update(profil: Profil) {
        return this.http.put(this.serviceURL + '/Profil/'+profil.id, profil, this.httpOptions);
    }
    public delete(profil: Profil) {
        return this.http.delete(this.serviceURL + '/Profil_droit/'+profil.id, this.httpOptions);
    }
    /* droit */
    public findAllDroit() {
        return this.http.get(this.serviceURL + '/Droit' , this.httpOptions);
    }
}
