import {
  Controller,
  controller,
  get,
  post,
  dto,
  DataTransferObject,
  response,
  back,
  param,
} from '@envuso/core/Routing';
import { ObjectId } from 'mongodb';
import { Item } from '../../Models/Item';
import { Inertia } from '@envuso/core/Packages/Inertia/Inertia';

class ItemDTO extends DataTransferObject {
  list: ObjectId;
  title: string;
}

//@middleware()
@controller('/item')
export class ItemController extends Controller {
  @post('/')
  async insertItem(@dto(false) body: ItemDTO) {
    const item = new Item();
    item.list = body.list;
    item.title = body.title;
    item.createdAt = new Date();
    await item.save();

    return back();
  }

  @get('/:list')
  async getAllFromList(@param list: string) {
    return response().json({ m: 'some' });
  }
}
