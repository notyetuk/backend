import { Model } from '@envuso/core/Database';
import { ObjectId } from 'mongodb';

export class ApiKey extends Model<ApiKey> {

  user: ObjectId;
  key: string;

}
