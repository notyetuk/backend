import {
  context,
  Controller,
  controller,
  get,
  middleware,
  param,
  post,
  request,
  response,
} from '@envuso/core/Routing';
import { Storage } from '@envuso/core/Storage';
import { JwtMiddleware } from '../Middleware/JwtMiddleware';
import { User } from '../../Models/User';
import fs from 'fs/promises';

@controller('/user')
export class UserController extends Controller {

  @middleware(new JwtMiddleware())
  @post('/avatar')
  async postAvatar() {
    // this is bugged for the moment cannot create dirs
    const dirs = await Storage.directories('/');
    if (!dirs.includes('avatars')) {
      await fs.mkdir('./storage/avatars');
    }

    const userId = context().getAdditional('id');
    const file = request().file('avatar');

    if (!file) {
      return response().json({ error: 'No avatar was uploaded.' });
    }

    const fileNameToStore = [userId, file._extension].join('.');
    await Storage.put('/avatars', {
      filename: file.getOriginalFileName(),
      tempFilePath: file.getTempFilePath(),
      storeAs: fileNameToStore,
    });

    await User.query()
      .where({
        _id: userId,
      })
      .update({
        avatar: fileNameToStore,
      });


    return response().json({ message: 'file uploaded' });
  }

  @get('/avatar/:userId')
  async getUserAvatar(@param userId: string) {

    const user = await User.find(userId);

    if (!user.avatar) {
      return response().setCode(204).json({ message: 'no content here' });
    }

    const ava = await fs.readFile(`./storage/avatars/${user.avatar}`);

    response().setHeader('content-type', 'image/jpeg');
    response().setHeader('content-disposition', `inline; filename="${userId}"`);
    response().setResponse(ava, 200).send();
    return;
  }
}
