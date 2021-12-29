import {RequestContextContract} from "@envuso/core/Contracts/Routing/Context/RequestContextContract";
import {InertiaMiddleware} from "@envuso/core/Packages/Inertia/Middleware/InertiaMiddleware";
import {User} from "../../Models/User";

export class SetInertiaSharedDataMiddleware extends InertiaMiddleware {

	async handle(context: RequestContextContract) {
		// const userId = context.session.store().get<string>('user_id', null);
		// let user     = null;
		// if (userId) {
		// 	user = await User.find(userId, '_id');
		// }
		//
		// await super.handle(context);
		// console.log(context.session.store().items());
	}

	share(context: RequestContextContract) {
		return {
			errors : context.session.store().get('errors', null),
		};
	}

}
