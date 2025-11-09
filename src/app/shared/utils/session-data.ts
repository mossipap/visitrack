import {Injectable} from '@angular/core';
import {Deserializable} from '../models/deserializable';
import {Droit} from '../models/droit';
import { Utilisateur } from '../models/utilisateur';

@Injectable()
export class SessionData implements Deserializable<SessionData> {

  public dateExpiration: Date;
  public utilisateur: Utilisateur;
  public droits: Droit[];
  public agents:Utilisateur[]

  deserialize(input: any): SessionData {
    Object.assign(this, input);
    return this;
  }
}
