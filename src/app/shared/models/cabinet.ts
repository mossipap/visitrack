import { Deserializable } from './deserializable';
import { Injectable } from '@angular/core';
import { Utilisateur } from './utilisateur';

@Injectable()
export class Cabinet implements Deserializable<Cabinet> {
    id: number;
    public user_id: number;
    designation: string;
    description: string;
    statut: string;
    created_at: Date;
    updated_at: Date;
    personnels: Utilisateur[]=[];
    selected?: boolean;
    deserialize(input: any): Cabinet {
        Object.assign(this, input);
        return this;
    }
}
