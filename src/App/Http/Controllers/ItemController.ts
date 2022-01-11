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
  put,
  delete_,
  context,
  middleware,
  request,
} from '@envuso/core/Routing';
import { ObjectId } from 'mongodb';
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
    item.price = parseInt(String(body.price));
    item.image = body.image;
    item.createdAt = new Date();
    item.user = context().getAdditional<string>('id');
    item.url = body.url;
    await item.save();

    return response().json({ message: 'item added', item }, 200);
  }

  @put('/save/:id')
  async saveItem() {
    const userId = context().getAdditional('id');
    const body = request().body<any>();

    await Item.query()
      .where({
        user: userId,
        _id: body.id,
      })
      .update({
        title: body.title,
        image: body.image,
        url: body.url,
        price: parseInt(String(body.price)),
      });

    const item = await Item.query()
      .where({
        user: userId,
        _id: body.id,
      })
      .get();

    return response().json({ item, message: 'item updated' }, 200);
  }

  @delete_('/:list/:id')
  async deleteItem() {
    // const id = request().get<string>('id');
    // const list = request().get<string>('list');
    const { list, id } = request().params().all();
    await Item.query().where('_id', id).delete();

<<<<<<< HEAD
    return Inertia.location(`/list/${list}`);
=======
    return response().json({ message: 'item deleted' }, 200);
>>>>>>> 584e4689b520a76a94d02ee787451524c52716c9
  }
}
