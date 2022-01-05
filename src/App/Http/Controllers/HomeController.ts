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
@controller('/auth')
export class HomeController extends Controller {
  @post('/login')
  async doLogin(@dto(false) loginDto: LoginDTO) {
    if (!loginDto.username || !loginDto.password) {
      return response().json({ message: 'fill all details' }, 401);
    }

    const _user = await User.find(loginDto.username, 'username');

    if (!_user) {
      return response().json({ message: 'user not found' }, 401);
    }

    if (!Hash.check(loginDto.password, _user.password)) {
      return response().json({ message: 'wrong password' }, 401);
    }

    // Auth.authoriseAs(_user);
    return response().json({ message: 'logged in' }, 200);
  }

  @post('/register')
  async register(@dto(false) registerDto: RegisterDTO) {
    if (!registerDto.username || !registerDto.password) {
      return response().json({ message: 'fill all details' }, 401);
    }

    const _user = await User.find(registerDto.username, 'username');
    if (_user) {
      return response().json({ message: 'username already exists' }, 200);
    }

    // await registerDto.validate();
    registerDto.createdAt = new Date();

    const user = new User();
    user.username = registerDto.username;
    user.password = await Hash.make(registerDto.password);
    user.createdAt = registerDto.createdAt;
    await user.save();

    return response().json({ message: 'registered' }, 200);
  }

  @get('/logout')
  async logout() {
    await request().session().invalidate();

    return response().json({ message: 'logged out' }, 200);
  }
}
