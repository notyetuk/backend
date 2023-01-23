import { id, Model } from "@envuso/core/Database";
import { ObjectId } from "mongodb";

export class Item extends Model<Item> {

    @id
    _id : ObjectId;

    list: ObjectId;
    title: string;
    price: number;
    image: string;
    createdAt: Date;

    user: string;
    url: string;

}
