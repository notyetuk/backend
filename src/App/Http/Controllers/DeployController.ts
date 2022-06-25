import { Controller, controller, post, request } from '@envuso/core/Routing'

@controller('/deploy')
export class DeployController extends Controller {
  @post('/frontend')
  deployFrontend() {

    const { action } = request().body();

    if (!action) {
      return;
    }

    console.log(action);

    return;
  }
}
