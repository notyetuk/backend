import { Controller, controller, post, request, response } from '@envuso/core/Routing';
import { frontendBuilder } from '../../Services/BuilderService';

@controller('/deploy')
export class DeployController extends Controller {
  @post('/frontend')
  async deployFrontend() {
    const { action, pull_request } = request().body();

    if (action !== 'closed' || !pull_request) {
      return;
    }

    if (pull_request.base && pull_request.base.ref !== 'main') {
      return;
    }

    // run frontend script
    frontendBuilder();

    return response().json({ done: 'build all done and deployed...' }, 200);
  }
}
