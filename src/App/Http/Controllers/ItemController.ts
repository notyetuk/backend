import {
  Controller,
  controller,
  get,
  post,
  dto,
  DataTransferObject,
  response,
  back,
  param, delete_,
} from '@envuso/core/Routing';
import { ObjectId } from 'mongodb';
import { Item } from '../../Models/Item';
import { session } from '@envuso/core/Session';

class ItemDTO extends DataTransferObject {
  list: ObjectId;
  title: string;
  image: string;
  url: string;
}

//@middleware()
@controller('/item')
export class ItemController extends Controller {
  @post('/')
  async insertItem(@dto(false) body: ItemDTO) {
    const item = new Item();
    item.list = body.list;
    item.title = body.title;
    item.image = body.image;
    item.createdAt = new Date();
    item.user = session().store().get('user_id');
    item.url = body.url;
    await item.save();

    return back();
  }

  @delete_('/:id')
  async deleteItem(@param id: string) {
    await Item.query().where('_id', id).delete();

    return back();
  }
}
