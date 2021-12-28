import {Inertia} from "@envuso/core/Packages/Inertia/Inertia";
import {
  Controller,
  controller,
  get
} from "@envuso/core/Routing";

// @middleware()
@controller('/')
export class HomeController extends Controller {

  @get('/')
  public async index() {
    return Inertia.render('Home', {});
  }

}
