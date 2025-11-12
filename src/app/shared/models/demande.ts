import { Deserializable } from './deserializable';
import { Injectable } from '@angular/core';
import { TypeUser } from './type-user';
import { Cabinet } from './cabinet';

@Injectable()
export class Demande implements Deserializable<Demande> {

  public id!: number;
  public user_agent_id: number;
  public service_id: number;
  public visiteur_id: number;
  public user_id: number;
  public nomComplet!: string;
   public sexe: string = 'Homme';
  public heureArrive!: string;
  public typePiece: string = 'CNI';
  public numeroPiece!: string;
  public signature!: string;
  public numeroTelephone!: string;
  public fonction!: string;
  public adresse!: string;
  public heureVisite!: string;
  public heureDepart!: string;
  public remarque!: string;
  public statut!: string;
  public typeUser: TypeUser;
  public cabinet: Cabinet;
  public service_name: string;
  public raisonVisite:string;
  public objet_saisie : string;
  public objet_retirer : string;
  public dateCreation!: Date;
  public created_at!: Date;
  public dateVisite: Date = new Date();
  public dateModification!: Date;
  deserialize(input: any): Demande {
    Object.assign(this, input);
    return this;
  }
}
