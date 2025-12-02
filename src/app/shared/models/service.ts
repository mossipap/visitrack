import { Deserializable } from './deserializable';
import { Injectable } from '@angular/core';
@Injectable()
export class Service implements Deserializable<Service> {
  id: number;
  public user_id: number;
  designation: string;
  description: string;
  statut: string;
  created_at: Date;
  updated_at: Date;
  user: any[] = [];
  selected?: boolean;
  deserialize(input: any): Service {
    Object.assign(this, input);
    return this;
  }
}
