import { Deserializable } from './deserializable';
import { Injectable } from '@angular/core';
import { Cabinet } from './cabinet';
import { Service } from './service';
import { Demande } from './demande';

@Injectable()
export class Visiteur implements Deserializable<Visiteur> {
 public id!: number;
  public cabinet_id: number;
  public service_id: number;
  public visiteur_id: number;
  public user_id: number;
  public nomComplet!: string;
  public nom!: string;
  public prenom!: string;
  public sexe: string = 'Homme';
  public heureArrive!: string;
  public typePiece: string = 'CNI';
  public numeroPiece!: string;
  public signature!: string;
  public scan_piece!: string;
  public numeroTelephone!: string;
  public telephone_secondaire!: string;
  public indicatif: string = '+225';
  public fonction!: string;
  public adresse!: string;
  public heureVisite!: string;
  public heureDepart!: string;
  public remarque!: string;
  public statut!: string;
  public service: Service;
  public cabinet: Cabinet;
  public visiteur: Visiteur;
  public service_name: string;
  public raisonVisite:string;
  public objet_saisie :any[] =[]
  public objet_retirer : any[] =[];
  public dateCreation!: Date;
  public created_at!: Date;
  public dateVisite: Date = new Date();
  public dateNaissance: Date = new Date();
  public dateDelivrance: Date = new Date();
  public dateExepiration: Date = new Date();
  nationalite:string;
  lieu_naissance:string;
  public dateModification!: Date;
  public pieceUrl!: any  ;
  commentaire: string
  autreObjet: string
  public selected?: boolean; // facultatif avec ?
   public demande: Demande[]=[];
  deserialize(input: any): Visiteur {
    Object.assign(this, input);
    return this;
  }
}
