import {
  Controller,
  controller,
  get,
  post,
  dto,
  DataTransferObject,
  param,
  response,
  request,
  back,
} from '@envuso/core/Routing';
import { List } from '../../Models/List';
import { Item } from '../../Models/Item';
import { Inertia } from '@envuso/core/Packages/Inertia/Inertia';

class ListDTO extends DataTransferObject {
  title: string;
  cover: string;
}

interface Pagination {
  page: number;
  limit: number;
}

//@middleware()
@controller('/list')
export class ListController extends Controller {
  @get('/')
  async retrieveLists() {
    const lists = await List.query().orderByDesc('createdAt').get();
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
      .whereAllIn('list', [id])
      .orderByDesc('createdAt')
      .get({limit: limit | 8, skip});
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
    await list.save();

    return back();
    // return response().redirect('/list');
    // return response().json({ m: 'list added' });
  }
}
