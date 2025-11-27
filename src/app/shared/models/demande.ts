import { Deserializable } from './deserializable';
import { Injectable } from '@angular/core';
import { Service } from './service';
import { Cabinet } from './cabinet';
import { Visiteur } from './visiteur';

@Injectable()

export class Demande implements Deserializable<Demande> {

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
  public numeroTelephone!: string;
  public telephone_secondaire!: string;
  public indicatif: any = '+225';
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
  public dateCreation!: Date;
  public created_at!: Date;
  public dateVisite: Date = new Date();
  public dateNaissance: Date = new Date();
  public dateDelivrance: Date = new Date();
  public dateExepiration: Date = new Date();
  public objet_saisie :any[] =[]
  public objet_retirer : any[] =[];
  nationalite:string;
  lieu_naissance:string;
  public dateModification!: Date;
  public pieceUrl!: any  ;
  public photoVisiteur!: string  ;
  public paysDelivrance!: string  ;
  public signature!: string;
  public scan_piece_rectro: string = " ";
  public scan_piece_verso: string ;
  public isDepartement: string = 'SIEGE';
  commentaire: string
  autreObjet: string
  public selected?: boolean; // facultatif avec ?
  deserialize(input: any): Demande {
    Object.assign(this, input);
    return this;
  }
}
