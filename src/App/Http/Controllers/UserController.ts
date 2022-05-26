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

  @get('/avatar/:username')
  async getUserAvatar(@param username: string) {
    const user = await User.query().where({ username }).get();

    if (!user.length) {
      return response().setCode(204).json({ message: 'no content here' });
    }

    let avatarBuffer;
    try {
      avatarBuffer = await fs.readFile(`./storage/avatars/${user[0].avatar ?? 'placeholder.png'}`);
    } catch (error) {
      return response().send();
    }

    response().setHeader('content-type', 'image/jpeg');
    response().setHeader('content-disposition', `inline; filename="${user[0]._id}"`);
    response().setResponse(avatarBuffer, 200).send();
    return;
  }
}
