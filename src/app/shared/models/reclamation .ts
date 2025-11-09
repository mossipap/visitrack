import { Deserializable } from './deserializable';
import { Injectable } from '@angular/core';

@Injectable()
export class Reclamation implements Deserializable<Reclamation> {
  public id!: number;
  public demande_id: number =0;
  public user_agent_id: number =0;
  public user_personnel_id: number =0;
  public texte!: string;
  public statut: string;
  public dateCreation!: Date;
  public dateModification!: Date;
  deserialize(input: any): Reclamation {
    Object.assign(this, input);
    return this;
  }
}
