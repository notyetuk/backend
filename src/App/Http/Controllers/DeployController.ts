import * as path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { Controller, controller, post, request, response } from '@envuso/core/Routing';

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
    const script = path.resolve(process.cwd(), '../frontend.sh');
    const buildProcess = await promisify(exec);
    await buildProcess(`sh ${script}`);

    return response().json({ done: 'build all done and deployed...' }, 200);
  }
}
