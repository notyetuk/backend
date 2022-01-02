import { Inertia } from '@envuso/core/Packages/Inertia/Inertia';
import {
  Controller,
  controller,
  get,
  post,
  dto,
  response,
  DataTransferObject,
  back,
  request,
} from '@envuso/core/Routing';
import { Auth } from '@envuso/core/Authentication';
import { User } from '../../Models/User';
import { Hash } from '@envuso/core/Crypt';

class LoginDTO extends DataTransferObject {
  username: string;
  password: string;
}

class RegisterDTO extends DataTransferObject {
  username: string;
  password: string;
  createdAt: Date;
}

// @middleware()
@controller('/')
export class HomeController extends Controller {
  @get('/')
  public async index() {
    // return response().redirect('/list');
    return Inertia.render('Home', {});
  }

  @post('/login')
  async doLogin(@dto(false) loginDto: LoginDTO) {
    if (!loginDto.username || !loginDto.password) {
      return back().with('errors', 'enter all details');
    }

    const _user = await User.find(loginDto.username, 'username');

    if (!_user) {
      return back().with('errors', 'user not found');
    }

    if (!Hash.check(loginDto.password, _user.password)) {
      return back().with('errors', 'wrong password');
    }

    Auth.authoriseAs(_user);

    return Inertia.location('/list');
  }

  @post('/register')
  async register(@dto(false) registerDto: RegisterDTO) {
    const _user = await User.find(registerDto.username, 'username');
    if (_user) {
      return back().with('errors', 'username already registered');
    }

    // await registerDto.validate();
    registerDto.createdAt = new Date();

    const user = new User();
    user.username = registerDto.username;
    user.password = await Hash.make(registerDto.password);
    user.createdAt = registerDto.createdAt;
    await user.save();

    return Inertia.location('/');
  }

  @get('/logout')
  async logout() {
    await request().session().invalidate();

    return Inertia.location('/');
  }
}
