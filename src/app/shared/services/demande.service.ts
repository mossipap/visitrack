import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppUtil } from 'src/app/shared/utils/App-util';
import { Demande } from '../models/demande';
import { SearchParam } from '../utils/search-param';
import { Visiteur } from '../models/visiteur';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  private serviceURL: string;
  private httpOptions: any;

  constructor(private http: HttpClient) {
    this.serviceURL = new AppUtil().getBaseUrlService();
    this.httpOptions = new AppUtil().httpHeaders();
  }

  public findAll() {
    return this.http.get(this.serviceURL + '/Demande?Demande=available', this.httpOptions);
  }
  public findAllVisiteur() {
    return this.http.get(this.serviceURL + '/Visiteur?Visiteur=available', this.httpOptions);
  }

  public findByNumero(search: SearchParam) {
    return this.http.get(this.serviceURL + '/VisiteurByNumero/'+ search.query, this.httpOptions);
  }
  public findById(userId: any) {
    return this.http.get(this.serviceURL + '/Demande/'+ userId, this.httpOptions);
  }

  public findByTypeuserId(typeId: any) {
    return this.http.get(this.serviceURL + '/DemandeByTypeuser/'+ typeId, this.httpOptions);
  }

  public findByCabinetId(cabinetId: any) {
    return this.http.get(this.serviceURL + '/DemandeByCabinetId/'+ cabinetId, this.httpOptions);
  }

  public findByServiceName(serviceName: any) {
    return this.http.get(this.serviceURL + '/DemandeByService/'+ serviceName, this.httpOptions);
  }

  public save(demande: Demande) {
    return this.http.post(this.serviceURL + '/Demande', demande, this.httpOptions);
  }

  public update(demande: Demande) {
    return this.http.put(this.serviceURL + '/Demande/'+demande.id, demande, this.httpOptions);
  }

  public updateImage(demande: Demande) {
    return this.http.put(this.serviceURL + '/UpdateImage64/'+demande.id, demande, this.httpOptions);
  }

  public updateStatut(demande: Demande) {
    return this.http.put(this.serviceURL + '/Demandestatut/'+demande.id, demande, this.httpOptions);
  }
  public delete(demande: Demande) {
    return this.http.delete(this.serviceURL + '/Demande/'+demande.id, this.httpOptions);
  }
  public deleteVisiteur(v: Visiteur) {
    return this.http.delete(this.serviceURL + '/Visiteur/'+v.id, this.httpOptions);
  }
}
