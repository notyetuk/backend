import { get, Controller, controller, request, response } from '@envuso/core/Routing';

@controller('/share')
export class ShareListController extends Controller {
  @get('/l/:id')
  async shareList() {
    const { id } = request().params().all();

    return response().json({ message: 'list to share yay' }, 200);
  }
}
