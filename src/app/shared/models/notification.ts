import { Deserializable } from './deserializable';
import { Injectable } from '@angular/core';

@Injectable()
export class NotificationObjet implements Deserializable<NotificationObjet> {
  id: number;
  user_id: number;
  demande_id: number;
  titre: string;
  statut: string;
  message: string;
  image: string;
  created_at: Date;
  updated_at: Date;
  type?: 'info' | 'success' | 'warning' | 'danger'; // <- ajouter ce champ
  deserialize(input: any): NotificationObjet {
    Object.assign(this, input);
    return this;
  }
}
