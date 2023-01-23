import { context, controller, Controller, middleware, post, response } from '@envuso/core/Routing';
import { ApiMiddleware } from '../Middleware/ApiMiddleware';
import { ApiKey } from '../../Models/ApiKey';
import { UnauthorisedException } from '../../Exceptions/UnauthorisedException';

@controller('/api')
@middleware(new ApiMiddleware())
export class ApiController extends Controller {
  @post('/item')
  async postItem() {
    const ctx = context();

    const user = await ApiKey.query().where({ key: ctx.getAdditional('api-key') }).first();

    if (!user) {
      throw new UnauthorisedException('invalid api key');
    }

    return response().setResponse({ user }, 200);
  }
}
