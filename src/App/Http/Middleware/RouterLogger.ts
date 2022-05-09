import { Middleware, request } from '@envuso/core/Routing';
import {
  RequestContextContract,
} from '@envuso/core/Contracts/Routing/Context/RequestContextContract';

export class RouterLogger extends Middleware {
  handle(context: RequestContextContract): Promise<any> {

    const routeLog = `${request().method()} :: ${request().url()} :: ${request().ip()}`;

    console.log(routeLog);
    return Promise.resolve(undefined);
  }
}
