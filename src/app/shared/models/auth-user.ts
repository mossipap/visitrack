import { Deserializable } from './deserializable';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthUser implements Deserializable<AuthUser> {
  id: number;
  confirmPassword: string
  newPassword: string
  oldPassword: string
  password: string
  login_id: string
  token: string
  userId: number
  username: string;
  email: string;

  deserialize(input: any): AuthUser {
    Object.assign(this, input);
    return this;
  }
}
