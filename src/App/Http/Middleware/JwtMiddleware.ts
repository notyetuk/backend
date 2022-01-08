import { Middleware, request, response } from '@envuso/core/Routing';
import { RequestContextContract } from '@envuso/core/Contracts/Routing/Context/RequestContextContract';
import { verify } from 'jsonwebtoken';
import Environment from '@envuso/core/AppContainer/Config/Environment';

interface PayLoad {
  id: string;
}

export class JwtMiddleware extends Middleware {
  async handle(context: RequestContextContract): Promise<any> {
    const { authorization } = request().headers();
    let token: string;
    if (typeof authorization === 'string') {
      token = authorization.split(' ')[1];
    }

    // @ts-ignore
    if (token !== 'null' && token !== '') {
      const { id } = await <PayLoad>verify(token, Environment.get<string>('APP_KEY'));
      context.setAdditional('id', id);
    }

    return response().json({ m: 'unauthorized access' }, 401);
  }
}
