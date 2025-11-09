import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AppUtil } from 'src/app/shared/utils/App-util';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
  private serviceURL: string;
  private httpOptions: any;

  constructor(private http: HttpClient) {
      this.serviceURL = environment.apiUrl;
      this.httpOptions = new AppUtil().httpHeaders();
  }

  public findTotalDosEnCour() {
    return this.http.get(this.serviceURL + '/Nbrs_dossierEnCours' , this.httpOptions);
  }
  public findTotalOrdo() {
    return this.http.get(this.serviceURL + '/NbrOrdonnance' , this.httpOptions);
  }
  public findStatistiqueOrdo() {
    return this.http.get(this.serviceURL + '/StatistiqueOrd' , this.httpOptions);
  }
  public statisticOrdoByCabinet(cabinetId: number) {
    return this.http.get(this.serviceURL + '/StatistiqueOrdByCabinet/'+cabinetId , this.httpOptions);
  }

  public findDetentionAlert() {
    return this.http.get(this.serviceURL + '/AlertDetention' , this.httpOptions);
  }
  public findSousMandatDepot(tpInfraId: number) {
    return this.http.get(this.serviceURL + '/Sous_mandat/' + tpInfraId , this.httpOptions);
  }
  public findActeDossiers() {
    return this.http.get(this.serviceURL + '/GetActeDossiers' , this.httpOptions);
  }
  /* =============by cabinet========== */
  public statisDossierByCabinet(cabinetId: number) {
    return this.http.get(this.serviceURL + '/StatistDossierByCabinet/'+cabinetId , this.httpOptions);
  }
  public NbreDossierByCabinet(cabinetId: number) {
    return this.http.get(this.serviceURL + '/NbrDossierByCabinet/'+cabinetId , this.httpOptions);
  }
}
