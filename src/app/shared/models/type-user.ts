import { Deserializable } from './deserializable';
import { Injectable } from '@angular/core';
@Injectable()
export class TypeUser implements Deserializable<TypeUser> {
  id: number;
  designation: string;
  description: string;
  statut: string;
  created_at: Date;
  updated_at: Date;
  user: any[] = [];
  selected?: boolean;
  deserialize(input: any): TypeUser {
    Object.assign(this, input);
    return this;
  }
}
