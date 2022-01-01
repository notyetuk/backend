import {Inertia} from "@envuso/core/Packages/Inertia/Inertia";
import {
  Controller,
  controller,
  get, response,
} from '@envuso/core/Routing';

// @middleware()
@controller('/')
export class HomeController extends Controller {

  @get('/')
  public async index() {
    return response().redirect('/list');
    //return Inertia.render('Home', {});
  }

}
