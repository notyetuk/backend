import { get, Controller, controller, request, response } from '@envuso/core/Routing';
import { List } from '../../Models/List';
import { Item } from '../../Models/Item';

@controller('/share')
export class ShareListController extends Controller {
  @get('/l/:id')
  async shareList() {
    const { id } = request().params().all();
    const list = await List.query().where({
      _id: id,
      isPrivate: false,
    }).get();

    if (!list[0]) {
      return response().json({ items: [], message: `couldn't find list` }, 200);
    }

    const items = await Item.query().where({
      list: id
    }).get();

    return response().json({ items, message: 'list to share yay' }, 200);
  }
}
