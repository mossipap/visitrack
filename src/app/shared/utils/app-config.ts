import { Injectable } from '@angular/core';
import { Droit } from '../models/droit';
import * as SecureLS from 'secure-ls';
import { SessionData } from './session-data';
import { Utilisateur } from '../models/utilisateur';
@Injectable()
export class AppConfig {

  public dateExpiration: Date;
  public currentUser: Utilisateur;
  public droits: Droit[];
  public agents: Utilisateur[];

  constructor() {
    this.initSession();
  }

  initSession() {
    const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: 'MyAdminApp' });
    if (ls.get('current_session_visitrack')) {
      const config: SessionData = JSON.parse(ls.get('current_session_visitrack'));
      this.dateExpiration = config.dateExpiration;
      this.currentUser = JSON.parse(ls.get('current_session_visitrack')).user;
      this.currentUser.profil.droits = JSON.parse(ls.get('current_session_visitrack')).droits;
      this.droits = this.currentUser?.profil ? this.currentUser?.profil?.droits : [];
    }
  }
}
