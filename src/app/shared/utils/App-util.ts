import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Droit } from '../models/droit';
import { SearchParam } from './search-param';
import { AppConfig } from './app-config';
import { environment } from 'src/environments/environment';
import { Utilisateur } from '../models/utilisateur';


@Injectable()
export class AppUtil {

  static now = new Date();

  constructor() {
  }

  static dateDebut() {
    return { year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate() - 7 };
  }

  static dateFin() {
    return { year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate() };
  }

  static formatDate(date) {
    const d = new Date(Date.parse(date));
    return (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/' + ((date.getMonth() + 1) < 10 ? '0' + ((date.getMonth() + 1)) : ((date.getMonth() + 1))) + '/' + date.getFullYear();
  }

  static formatStringtoDate(date) {
    const d = new Date(Date.parse(date));

    return d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' + ((d.getMonth() + 1)) : ((d.getMonth() + 1))) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
  }

  static formatStringtoDateForExport(date) {
    const d = new Date(Date.parse(date));
    return (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + '-' + ((d.getMonth() + 1) < 10 ? '0' + ((d.getMonth() + 1)) : ((d.getMonth() + 1))) + '-' + d.getFullYear();
  }

  static formatDateYMD(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  static formatDateTo(date) {
    return (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/' + ((date.getMonth() + 1) < 10 ? '0' + ((date.getMonth() + 1)) : ((date.getMonth() + 1))) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  static formatDateToString(date) {
    return date.year + '-' + ((date.month) < 10 ? '0' + (date.month) : (date.month)) + '-' + ((date.day) < 10 ? '0' + (date.day) : (date.day));
  }

  public formatExportDateToString(date) {
    return date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate();
  }

  static addDays(date, numberOfDay) {
    return new Date(date.getTime() + numberOfDay * 24 * 60 * 60 * 1000);
  }

  static subDays(date, numberOfDay) {
    return new Date(date.getTime() - numberOfDay * 24 * 60 * 60 * 1000);
  }
  formatDateToSplitBySlash(date) {
    return (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ((date.getMonth() + 1) < 10 ? '0' + ((date.getMonth() + 1)) : ((date.getMonth() + 1))) + date.getFullYear() + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }
  formateDateToForNumero(date) {
    // date=date.parse();
    return (this.formatDateToSplitBySlash(date).replace(':', '').replace(' ', '').replace(':', ''));
  }

  isOutDate(start: Date) {
    if (!start) {
      return false;
    }
    const diff = Math.abs(new Date().getTime() - start.getTime());
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return diffDays > 0 ? true : false;
  }

  httpHeaders() {
    const currentUser: Utilisateur = this.getCurrentUser();
    let headers = new HttpHeaders();
    if (currentUser) { // token is present
      headers = headers.set('Authorization', currentUser.token ? currentUser.token : '' + '/' + currentUser.id + '/');
    }
    //headers = headers.set("Access-Control-Allow-Origin", "*");
    // headers = headers.set("Access-Control-Allow-Headers", "*");
    // headers = headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('Content-Type', 'application/json');
    // headers = headers.append('Authorization', currentUser.token ? currentUser.token : '' + '/' + search.magasinId + '/');
    const httpOptions = {
      headers
    };
    return httpOptions;
  }

  httpHeaderBios() {
    let headers = new HttpHeaders();
    headers.set('User-Agent', 'PostmanRuntime/7.42.0');
    headers.set('Content-Type', 'application/json;charset=UTF-8');
    headers.set('Accept', '*/*');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const httpOptions = {
      headers
    };
    return httpOptions;
  }
  getBaseUrlService() {
    return environment.apiUrl;
  }

  getCurrentUser(): Utilisateur {
    const conf = new AppConfig(); // JSON.parse(localStorage.getItem('current-session2'));
    if (conf.currentUser) {
      return conf.currentUser;
    }
  }

  /**
   * Contient quelques parametres de recherche
   *
   */
  getSearchParam(): SearchParam {
    const search: SearchParam = new SearchParam();
    const conf = new AppConfig(); // JSON.parse(localStorage.getItem('current-session2'));
    if (conf.currentUser) {
      //  if (conf.currentUser.societe && conf.currentUser.magasin) {
      // search.departementId = !conf.currentUser.isNgUser ? conf.currentUser.societe.id : null;
      // search.magasinId = !conf.currentUser.isNgUser ? conf.currentUser.magasin.id : null;
      //  }
    }

    search.enabled = true;
    search.dateDebut = new Date();
    search.dateDebut.setHours(0, 0, 0, 0);
    search.dateFin = AppUtil.addDays(new Date(), 1);
    search.dateFin.setHours(0, 0, 0, 0);
    search.criteria = '';
    return search;
  }

  /**
   * Permet d'avoir toutes les configurations pour la session de l'utilisateur
   * Cette config est chargé a authentification de l'utilisateur
   *
   */
  getSessionData(): AppConfig {
    const conf = new AppConfig(); // JSON.parse(localStorage.getItem('current-session2'));
    if (conf) {
      return conf;
    }
  }

  /**
   * Les droits de l'utilisateur current
   * @returns {Droit[]}
   */
  getDroits() {
    const conf = new AppConfig(); // JSON.parse(localStorage.getItem('current-session'));
    if (conf) {
      const droits: Droit[] = conf.droits;
      return droits;
    }
  }

  getDroitsID() {
    const ids: number[] = [];
    if (this.getDroits()) {
      const droits: Droit[] = this.getDroits();
      for (const droit of droits) {
        ids.push(droit.id);
      }
    }
    return ids;
  }

  fomatDateFromJson(date) {
    let dateSplit;
    if (typeof date === 'string') {
      dateSplit = date.replace('T', ' ').replace('.000Z', '');
      dateSplit = new Date(dateSplit);
    }
    else {
      dateSplit = date;
    }
    return dateSplit;
  }



  get() {
    const produit: any[] = [];
    return produit;
  }

}
