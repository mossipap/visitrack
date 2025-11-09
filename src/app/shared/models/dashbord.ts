import { Deserializable } from './deserializable';
import { Injectable } from '@angular/core';

@Injectable()
export class Dashbord implements Deserializable<Dashbord> {
  id: number;
  nbrDemande: number = 45412;
  nbrAgent: number = 40;
  nbrReclamation: number = 551
  deserialize(input: any): Dashbord {
    Object.assign(this, input);
    return this;
  }
}
