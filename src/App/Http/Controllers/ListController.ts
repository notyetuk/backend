import {
  context,
  Controller,
  controller,
  DataTransferObject,
  delete_,
  dto,
  get,
  middleware,
  param,
  post,
  request,
  response,
} from '@envuso/core/Routing';
import { List } from '../../Models/List';
import { Item } from '../../Models/Item';
import { session } from '@envuso/core/Session';
import { JwtMiddleware } from '../Middleware/JwtMiddleware';

class ListDTO extends DataTransferObject {
  title: string;
  cover: string;
}

interface Pagination {
  page: number;
  limit: number;
}

@middleware(new JwtMiddleware())
@controller('/list')
export class ListController extends Controller {
  @get('/')
  async retrieveLists() {
    const id = context().getAdditional<string>('id');
    const lists = await List.query().where('user', id).orderByDesc('createdAt').get();

    return response().json({
      lists,
    });
  }

  @get('/:id')
  async retrieveList(@param id: string) {
    const { page, limit } = request().query<Pagination>();
    let skip;
    if (page == 1 || page == 0) {
      skip = 0;
    } else if (page == 2) {
      skip = limit | 8;
    } else if (page > 2) {
      skip = (page - 1) * (limit | 8);
    }

    const list = await List.find(id);
    const items = await Item.query()
      // .whereAllIn('list', [id])
      // @ts-ignore
      .where({ list: id, user: context().getAdditional<string>('id') })
      .orderByDesc('createdAt')
      .get({ limit: limit | 8, skip });

    return response().json({ list, items }, 200);
  }

  @post('/')
  async createList(@dto(false) body: ListDTO) {
    const list = new List();
    list.title = body.title;
    list.cover = body.cover;
    list.createdAt = new Date();
    list.user = context().getAdditional<string>('id');
    await list.save();

    return response().json({ message: 'list added', list }, 200);
  }

  @delete_('/:id')
  async deleteList(@param id: string) {
    await List.query().where('_id', id).delete();

    return response().json({ message: 'list deleted' }, 200);
  }
}
