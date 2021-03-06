import {
  context,
  Controller,
  controller,
  DataTransferObject,
  delete_,
  dto,
  get,
  middleware,
  param,
  post,
  put,
  request,
  response,
} from '@envuso/core/Routing';
import { List } from '../../Models/List';
import { Item } from '../../Models/Item';
import { JwtMiddleware } from '../Middleware/JwtMiddleware';

class ListDTO extends DataTransferObject {
  title: string;
  cover: string;
}

interface Pagination {
  page: number;
  limit: number;
}

@middleware(new JwtMiddleware())
@controller('/list')
export class ListController extends Controller {
  lists: any[] = [];

  @get('/')
  async retrieveLists() {
    const id = context().getAdditional<string>('id');
    const userLists = await List.query().where('user', id).orderByDesc('createdAt').get();
    if (userLists.length === 0) {
      return response().json({ lists: this.lists }, 200);
    }

    await this.aggregateTotal(userLists);

    return response().json(
      {
        lists: this.lists,
      },
      200,
    );
  }

  async aggregateTotal(userLists: List[]): Promise<null> {
    return new Promise((resolve) => {
      userLists.forEach(async (l) => {
        await List.getCollection()
          .aggregate([
            {
              $match: {
                _id: l._id,
              },
            },
            {
              $addFields: {
                list: l._id.toString(),
              },
            },
            {
              $lookup: {
                from: 'items',
                localField: 'list',
                foreignField: 'list',
                as: 'items',
              },
            },
            {
              $addFields: {
                total: {
                  $sum: '$items.price',
                },
                items: { $size: '$items' },
              },
            },
          ])
          .forEach((l) => {
            this.lists.push(l);
          });
        if (userLists.length === this.lists.length) {
          this.lists.sort((a, b) => b.createdAt - a.createdAt);
          resolve(null);
        }
      });
    });
  }

  @get('/:id')
  async retrieveList(@param id: string) {
    const { page, limit } = request().query<Pagination>();
    let skip;
    if (page == 1 || page == 0) {
      skip = 0;
    } else if (page == 2) {
      skip = limit | 8;
    } else if (page > 2) {
      skip = (page - 1) * (limit | 8);
    }

    const list = await List.find(id);
    const items = await Item.query()
      // .whereAllIn('list', [id])
      // @ts-ignore
      .where({ list: id, user: context().getAdditional<string>('id') })
      .orderByDesc('createdAt')
      .get({ limit: limit | 8, skip });

    return response().json({ list, items }, 200);
  }

  @post('/')
  async createList(@dto(false) body: ListDTO) {
    const list = new List();
    list.title = body.title;
    list.cover = body.cover;
    list.createdAt = new Date();
    list.user = context().getAdditional<string>('id');
    await list.save();

    return response().json({ message: 'list added', list }, 200);
  }

  @put('/:id')
  async updateList() {
    const { id } = request().params().all();
    const { editTitle, editCover } = request().body();

    await List.query().where('_id', id).update({
      title: editTitle,
      cover: editCover,
    });
    const list = await List.query().where('_id', id).get();

    return response().json({ list, message: 'list updated' }, 200);
  }

  @put('/privacy/:id')
  async makePublic() {
    const { id } = request().params().all();
    const { isPrivate } = request().body();

    await List.query().where('_id', id).update({
      isPrivate: isPrivate,
    });
    const list = await List.query().where('_id', id).get();

    return response().json({ list, message: 'list updated' }, 200);
  }

  @delete_('/:id')
  async deleteList(@param id: string) {
    await List.query().where('_id', id).delete();

    return response().json({ message: 'list deleted' }, 200);
  }
}
