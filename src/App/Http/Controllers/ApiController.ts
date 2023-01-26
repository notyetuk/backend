import {
  context,
  controller,
  Controller,
  get,
  middleware,
  post,
  request,
  response,
} from '@envuso/core/Routing';
import { ApiMiddleware } from '../Middleware/ApiMiddleware';
import { ApiKey } from '../../Models/ApiKey';
import { UnauthorisedException } from '../../Exceptions/UnauthorisedException';
import { Item } from '../../Models/Item';
import { List } from '../../Models/List';

@controller('/api')
@middleware(new ApiMiddleware())
export class ApiController extends Controller {
  @post('/item')
  async postItem() {
    const ctx = context();
    const payload = request().body();

    const user = await ApiKey.query().where({ key: ctx.getAdditional('api-key') }).first();

    if (!user) {
      throw new UnauthorisedException('invalid api key');
    }

    const item = new Item();
    // @ts-ignore
    item.list = payload.list;
    // @ts-ignore
    item.title = payload.title;
    // @ts-ignore
    item.price = parseFloat(payload.price);
    // @ts-ignore
    item.image = payload.image;
    item.createdAt = new Date();
    item.user = user.user.toString();
    // @ts-ignore
    item.url = payload.url;
    await item.save();

    return response().setResponse({ user }, 200);
  }

  @get('/lists')
  async getLists() {
    const ctx = context();

    const user = await ApiKey.query().where({ key: ctx.getAdditional('api-key') }).first();

    if (!user) {
      throw new UnauthorisedException('invalid api key');
    }

    const lists = await List.get({ user: user.user });

    return response().setResponse(lists, 200);
  }
}
