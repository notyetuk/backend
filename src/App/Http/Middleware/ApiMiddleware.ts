import { Middleware, request } from '@envuso/core/Routing';
import {
  RequestContextContract,
} from '@envuso/core/Contracts/Routing/Context/RequestContextContract';
import { UnauthorisedException } from '../../Exceptions/UnauthorisedException';

export class ApiMiddleware extends Middleware {

  async handle(context: RequestContextContract): Promise<any> {
    const { authorization } = request().headers();

    if (!authorization) {
      throw new UnauthorisedException('no api key is present');
    }

    context.setAdditional('api-key', authorization);
  }

}
