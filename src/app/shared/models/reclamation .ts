import { Deserializable } from './deserializable';
import { Injectable } from '@angular/core';
import { Visiteur } from './visiteur';

@Injectable()
export class Reclamation implements Deserializable<Reclamation> {
  public id!: number;
  public visiteur_id!: number;
  public user_id!: number ;
  public texte!: string;
  public statut!: string;
  public visiteur!: Visiteur;
  public dateCreation!: Date;
  public dateModification!: Date;
  public selected:boolean;
  deserialize(input: any): Reclamation {
    Object.assign(this, input);
    return this;
  }
}
