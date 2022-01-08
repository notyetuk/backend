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
  delete_, context, middleware
} from '@envuso/core/Routing';
import { ObjectId } from 'mongodb';
import { Item } from '../../Models/Item';
import { JwtMiddleware } from '../Middleware/JwtMiddleware';

class ItemDTO extends DataTransferObject {
  list: ObjectId;
  title: string;
  image: string;
  url: string;
}

@middleware(new JwtMiddleware())
@controller('/item')
export class ItemController extends Controller {
  @post('/')
  async insertItem(@dto(false) body: ItemDTO) {
    const item = new Item();
    item.list = body.list;
    item.title = body.title;
    item.image = body.image;
    item.createdAt = new Date();
    item.user = context().getAdditional<string>('id');
    item.url = body.url;
    await item.save();

    return response().json({ message: 'item added', item }, 200);
  }

  @delete_('/:id')
  async deleteItem(@param id: string) {
    await Item.query().where('_id', id).delete();

    return response().json({ message: 'item deleted' }, 200);
  }
}
