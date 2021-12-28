import {
  Controller,
  controller,
  get,
  post,
  dto,
  DataTransferObject,
  param,
  response, request, back,
} from '@envuso/core/Routing';
import { List } from '../../Models/List';
import { Item } from '../../Models/Item';
import { Inertia } from '@envuso/core/Packages/Inertia/Inertia';

class ListDTO extends DataTransferObject {
  title: string;
}

//@middleware()
@controller('/list')
export class ListController extends Controller {
  @get('/')
  async retrieveLists() {
    const lists = await List.query().get();
    return Inertia.render('Lists', {
      lists,
    });
  }

  @get('/:id')
  async retrieveList(@param id: string) {
    const list = await List.find(id);
    const items = await Item.query().whereAllIn('list', [id]).orderByDesc('createdAt').get();
    return Inertia.render('List', {
      list,
      items
    });
  }

  @post('/')
  async createList(@dto(false) body: ListDTO) {
    const list = new List();
    list.title = body.title;
    list.createdAt = new Date();
    await list.save();

    return response().redirect('/list');
    // return response().json({ m: 'list added' });
  }
}
