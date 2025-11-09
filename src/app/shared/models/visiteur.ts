import { Deserializable } from './deserializable';
import { Injectable } from '@angular/core';
import { TypeUser } from './type-user';
import { Cabinet } from './cabinet';

@Injectable()
export class Visiteur implements Deserializable<Visiteur> {
  public id!: number;
   public user_agent_id: number;
   public service_id: number;
   public user_personnel_id: number= 1;
   public nomComplet!: string;
   public heureArrive!: string;
   public typePiece!: string;
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
   public dateCreation!: Date;
   public dateDuJour: Date = new Date();
   public dateModification!: Date;
  deserialize(input: any): Visiteur {
    Object.assign(this, input);
    return this;
  }
}
