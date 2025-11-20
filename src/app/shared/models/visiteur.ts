import { Deserializable } from './deserializable';
import { Injectable } from '@angular/core';
import { Cabinet } from './cabinet';
import { Service } from './service';
import { Demande } from './demande';

@Injectable()
export class Visiteur implements Deserializable<Visiteur> {
  public id!: number;
   public service_id: number;
   public user_personnel_id: number= 1;
   public nomComplet!: string;
   public nom!: string;
   public prenom!: string;
   public heureArrive!: string;
   public typePiece!: string;
   public pieceUrl!: any  ;
   public numeroPiece!: string;
   public sexe: string = 'Homme';
   public numeroTelephone!: string;
   public fonction!: string;
   public adresse!: string;
   public statut!: string;
   public service: Service;
   public cabinet: Cabinet;
   public service_name: string;
   public dateCreation!: Date;
   public dateModification!: Date;
   public selected?: boolean; // facultatif avec ?
   public demande: Demande[]=[];
  deserialize(input: any): Visiteur {
    Object.assign(this, input);
    return this;
  }
}
