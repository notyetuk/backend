import { Controller, controller, get, request } from '@envuso/core/Routing'

@controller('/deploy')
export class DeployController extends Controller {
  @get('/frontend')
  deployFrontend() {
    console.log('------ body ------');
    console.log(request().body());

    console.log('\n\n------ headers ------');
    console.log(request().headers());

    return;
  }
}
