import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable';
import { Cabinet } from './cabinet';
import { Profil } from './profil';
import { Service } from './service';

@Injectable()
export class Utilisateur implements Deserializable<Utilisateur> {
  public id: number;
  public cabinet_id: number;
  public service_id: number;
  public profil_id: number;
  public prenom: string;
  public nom: string;
  public sexe: string;
  public nomComplet: string;
  public telephone: string;
  public email: string;
  public adresse: string;
  public login: string;
  public password: string;
  public confirmpassword: string;
  public profession: string;
  public fonction: string;
  public organisation: string;
  public oldPassword: string = "0000";
  public newPassword: string= "0000";
  public commentaire: string = "PPEF";
  public token: string;
  public updated_at: Date;
  public created_at: Date;
  public dateNaissance: Date;
  public enabled: boolean = true;
  public statut: string;
  public groupeName: string = 'ppef';
  public image: string;
  public imageName: string;
  public link_image: string;
  public service_name: string;
  public profil: Profil;
  public service: Service;
  public cabinet: Cabinet;
  public checked: boolean = true;
  public isDepartement: string = 'SIEGE';
  public isConnected: boolean = true;
  selected?: boolean;
  deserialize(input: any): Utilisateur {
    Object.assign(this, input);
    return this;
  }
}
