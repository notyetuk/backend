import {
  Controller,
  controller,
  post,
  dto,
  DataTransferObject,
  response,
  param,
  put,
  delete_,
  context,
  middleware,
  request,
} from '@envuso/core/Routing';
import { Double, ObjectId } from 'mongodb';
import { Item } from '../../Models/Item';
import { JwtMiddleware } from '../Middleware/JwtMiddleware';

class ItemDTO extends DataTransferObject {
  list: ObjectId;
  title: string;
  price: number;
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
    item.price = parseFloat(String(body.price));
    item.image = body.image;
    item.createdAt = new Date();
    item.user = context().getAdditional<string>('id');
    item.url = body.url;
    await item.save();

    return response().json({ message: 'item added', item }, 200);
  }

  @put('/save/:id')
  async saveItem(@param id: string) {
    const userId = context().getAdditional('id');
    const body = request().body<any>();

    await Item.query()
      .where({
        user: userId,
        _id: id,
      })
      .update({
        title: body.title,
        image: body.image,
        url: body.url,
        price: parseFloat(String(body.price)),
      });

    const item = await Item.query()
      .where({
        user: userId,
        _id: id,
      })
      .get();

    return response().json({ item, message: 'item updated' }, 200);
  }

  @delete_('/:id')
  async deleteItem() {
    // const id = request().get<string>('id');
    // const list = request().get<string>('list');
    const { id } = request().params().all();
    await Item.query().where('_id', id).delete();

    return response().json({ message: 'item deleted' }, 200);
  }
}
