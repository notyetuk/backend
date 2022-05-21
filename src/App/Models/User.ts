import { Exclude, Expose } from 'class-transformer';
import { id } from '@envuso/core/Database';
import { Authenticatable } from '@envuso/core';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongodb';

export class User extends Authenticatable<User> {
  @id
  _id: ObjectId;

  username: string;
  email: string;
  password: string;

  avatar?: string;

  createdAt: Date;
}
