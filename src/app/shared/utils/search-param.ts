import {Injectable} from '@angular/core';
import { Deserializable } from '../models/deserializable';

@Injectable()
export class SearchParam implements Deserializable<SearchParam> {

  public id: number;
  public entityId: number;
  public dateDebut: Date = new Date();
  public dateFin: Date = new Date();
  public query: string;
  public type: string;
  public criteria: string;
  public enabled: boolean;

  deserialize(input: any): SearchParam {
    Object.assign(this, input);
    return this;
  }

  equals(obj: any): boolean {
    return true;
  }

}
