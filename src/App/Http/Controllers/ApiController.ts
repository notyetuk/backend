import {
  context,
  controller,
  Controller,
  middleware,
  post,
  request,
  response,
} from '@envuso/core/Routing';
import { ApiMiddleware } from '../Middleware/ApiMiddleware';
import { ApiKey } from '../../Models/ApiKey';
import { UnauthorisedException } from '../../Exceptions/UnauthorisedException';
import { Item } from '../../Models/Item';

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
    item.list = '--list-id--';
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
}
