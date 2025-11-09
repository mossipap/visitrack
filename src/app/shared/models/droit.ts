import { Deserializable } from './deserializable';
import { Injectable } from '@angular/core';
@Injectable()
export class Droit implements Deserializable<Droit> {
  id: number;
  nom: string;
  description: string;
  checked:boolean
  deserialize(input: any): Droit {
    Object.assign(this, input);
    return this;
  }
}
