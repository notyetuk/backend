import {
  back,
  Controller,
  controller,
  DataTransferObject,
  delete_,
  dto,
  get,
  param,
  post,
  request,
} from '@envuso/core/Routing';
import { List } from '../../Models/List';
import { Item } from '../../Models/Item';
import { Inertia } from '@envuso/core/Packages/Inertia/Inertia';
import { session } from '@envuso/core/Session';

class ListDTO extends DataTransferObject {
  title: string;
  cover: string;
}

interface Pagination {
  page: number;
  limit: number;
}

@controller('/list')
export class ListController extends Controller {
  @get('/')
  async retrieveLists() {
    const lists = await List.query()
      .where('user', session().store().get('user_id'))
      .orderByDesc('createdAt')
      .get();
    return Inertia.render('Lists', {
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
      .where({ list: id, user: session().store().get('user_id') })
      .orderByDesc('createdAt')
      .get({ limit: limit | 8, skip });
    return Inertia.render('List', {
      list,
      items,
    });
  }

  @post('/')
  async createList(@dto(false) body: ListDTO) {
    const list = new List();
    list.title = body.title;
    list.cover = body.cover;
    list.createdAt = new Date();
    list.user = session().store().get('user_id');
    await list.save();

    return back();
    // return response().redirect('/list');
    // return response().json({ m: 'list added' });
  }

  @delete_('/:id')
  async deleteList(@param id: string) {
    await List.query().where('_id', id).delete();

    return back();
  }
}
