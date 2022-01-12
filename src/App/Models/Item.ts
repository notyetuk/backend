
import { Exclude, Expose, Type } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";
import { id, Model } from "@envuso/core/Database";
import { Double, ObjectId } from "mongodb";

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
