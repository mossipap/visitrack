import { Deserializable } from './deserializable';
import { Injectable } from '@angular/core';
import { Droit } from './droit';
@Injectable()
export class Profil implements Deserializable<Profil> {
  public id: number;
  public user_id: number;
  public nom: string;
  public description: string;
  public droits: Droit[];
  public otherDroits: Droit[];
  public statut: string = 'Activé';
 // public enabled!: Boolean;
 selected?: boolean; // facultatif avec ?
  deserialize(input: any): Profil {
    Object.assign(this, input);
    return this;
  }
}
