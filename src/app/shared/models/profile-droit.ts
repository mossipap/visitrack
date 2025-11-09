import { Deserializable } from './deserializable';
import { Injectable } from '@angular/core';
import { Droit } from './droit';
import { Profil } from './profil';
@Injectable()
export class ProfileDroit implements Deserializable<ProfileDroit> {
  public id: number;
  public profile: Profil;
  public commentaire: string = "PPEF";
  public droit: Droit;
  public enabled: boolean;

  deserialize(input: any): ProfileDroit {
    Object.assign(this, input);
    return this;
  }
}
