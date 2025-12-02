import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Utilisateur } from '../../shared/models/utilisateur';
import { AppUtil } from 'src/app/shared/utils/App-util';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private serviceURL: string;
  private httpOptions: any;
  private serviceUrlBiostar: string;
  private httpOptionBios: any;

  constructor(private http: HttpClient) {
    this.serviceURL = new AppUtil().getBaseUrlService();
    this.httpOptions = new AppUtil().httpHeaders();
    this.httpOptionBios = new AppUtil().httpHeaderBios();
  }

  public findAll() {
    return this.http.get(this.serviceURL + '/Users', this.httpOptions);
  }

  public findById(userId: any) {
    return this.http.get(this.serviceURL + '/User/'+ userId, this.httpOptions);
  }

  public findByTypeuserId(typeId: any) {
    return this.http.get(this.serviceURL + '/ByTypeuser/'+ typeId, this.httpOptions);
  }

  public findByCabinetId(cabinetId: any) {
    return this.http.get(this.serviceURL + '/UserByCabinetId/'+ cabinetId, this.httpOptions);
  }

  public findByServiceName(serviceName: any) {
    return this.http.get(this.serviceURL + '/UserByService/'+ serviceName, this.httpOptions);
  }

  public save(utilisateur: Utilisateur) {
    return this.http.post(this.serviceURL + '/Register', utilisateur, this.httpOptions);
  }

  public update(utilisateur: Utilisateur) {
    return this.http.put(this.serviceURL + '/User/'+utilisateur.id, utilisateur, this.httpOptions);
  }

  public updateImage(utilisateur: Utilisateur) {
    return this.http.put(this.serviceURL + '/UpdateImage64/'+utilisateur.id, utilisateur, this.httpOptions);
  }

  public updateStatut(utilisateur: Utilisateur) {
    return this.http.put(this.serviceURL + '/Userstatut/'+utilisateur.id, utilisateur, this.httpOptions);
  }

  public verifyJugeOfCabinet(objetCheck: any) {
    return this.http.post(this.serviceURL + '/VerifyJugeOfCabinet', objetCheck, this.httpOptions);
  }

  public delete(utilisateur: Utilisateur) {
    return this.http.put(this.serviceURL + '/DeleteUser/'+utilisateur.id, utilisateur, this.httpOptions);
  }
  public desactiver(utilisateur: Utilisateur) {
    return this.http.get(this.serviceURL + '/StatutDesactive/'+utilisateur.id, this.httpOptions);
  }
  public activer(utilisateur: Utilisateur) {
    return this.http.get(this.serviceURL + '/StatutActive/'+utilisateur.id, this.httpOptions);
  }

  public changePassword(utilisateur: Utilisateur) {
    return this.http.put(this.serviceURL + '/Modifypassword/'+utilisateur.id, utilisateur, this.httpOptions);
  }

  public authBiostar(auth: any) {
    return this.http.post(this.serviceUrlBiostar + '/login', auth, this.httpOptionBios);
  }
}
