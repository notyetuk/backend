import {
  context,
  Controller,
  controller,
  get,
  middleware,
  param,
  post,
  put,
  request,
  response,
} from '@envuso/core/Routing';
import { Storage } from '@envuso/core/Storage';
import { JwtMiddleware } from '../Middleware/JwtMiddleware';
import { User } from '../../Models/User';
import fs from 'fs/promises';
import * as crypto from 'crypto';
import { ApiKey } from '../../Models/ApiKey';
import { ObjectId } from 'mongodb';

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
      // I want a fallback avatar in case the file does not exist...
      avatarBuffer = await fs.readFile(`./storage/avatars/placeholder.png`);
    }

    response().setHeader('content-type', 'image/jpeg');
    response().setHeader('content-disposition', `inline; filename="${user[0]._id}"`);
    response().setResponse(avatarBuffer, 200);
    return;
  }

  @middleware(new JwtMiddleware())
  @put('/api-key')
  async generateApiKey() {
    const userId = context().getAdditional('id');
    const key = crypto.randomUUID();

    const oldKey = await ApiKey.query().where({ user: userId }).count();

    if (oldKey) {
      const newKey = await ApiKey.getCollection().findOneAndUpdate(
        { user: userId },
        { $set: { key: key } },
        { returnDocument: 'after' },
      );
      return response().setResponse({ message: 'api key updated', key: newKey.value.key }, 200);
    }

    const apiKey = await ApiKey.create({
      user: userId as ObjectId,
      key: key,
    });

    return response().setResponse({ message: 'new api key created', key: apiKey.key }, 200);
  }

  @middleware(new JwtMiddleware())
  @get('/api-key')
  async getApiKey() {
    const userId = context().getAdditional('id');

    const apiKey = await ApiKey.query().where({ user: userId }).first();

    return response().setResponse(apiKey, 200);
  }
}
